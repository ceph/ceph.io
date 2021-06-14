---
title: "Dynamic Object Interfaces with Lua"
date: "2013-10-29"
author: "noah"
tags: 
  - "lua"
---

In this post I’m going to demonstrate how to dynamically extend the interface of objects in RADOS using the [Lua](http://www.lua.org/) scripting language, and then build an example service for image thumbnail generation and storage that performs remote image processing inside a target object storage device (OSD). We’re gonna have a lot of fun.

Before we get started, since this is my first post on ceph.com, I want to introduce myself. I’m [Noah Watkins](http://twitter.com/noahdesu), a PhD student and an occasional contributor to the Ceph project. I worked for [Inktank](http://www.inktank.com) over the summer, and also I maintain the Ceph Hadoop bindings.

.

# RADOS Object Classes

One of the less publicized features of the RADOS object store is the ability to extend the object interface by writing C/C++ plugins that add new remote execution targets that may perform arbitrary operations on object data. The ability to add user-defined functionality to the OSD is a very powerful feature allowing applications to reduce network round-trips and data movement, exploit remote resources, and simplify otherwise complex interfaces by taking advantage of the transactional context within which remote operations execute. But that’s enough marketing—here is a very simple example that computes the MD5 hash of an object without transferring the object payload over the network.

## Example: MD5 Hash of Object

The straightforward method for a client to compute the MD5 hash of an object is to first retrieve the entire object and then apply the MD5 hash function to the data locally. Using librados and the crypotpp library, this might look something like the following:

bufferlist data;
size\_t size;

ioctx.read("my\_obj", data, 0, 0);

byte digest\[AES::BLOCKSIZE\];
MD5().CalculateDigest(digest, (byte\*)data.c\_str(), data.length());

Here the client first reads the entire object over the network, and then computes the MD5 hash of the object data. However, transferring the entire object to the client can be avoided by introducing a custom object interface for computing the MD5 hash within the storage system. The following code snippet illustrates the basics of how an MD5 hash could be computed using the object class facility. Note that the following code would in practice be compiled into a shared library and loaded dynamically into a running OSD process, but we’ve omitted the deployment details to keep things simple (there are links at the end of this section to more information on getting started with object classes).

int compute\_md5(cls\_method\_context\_t hctx, bufferlist \*in, bufferlist \*out)
{
  size\_t size;
  int ret \= cls\_cxx\_stat(hctx, &size, NULL);
  if (ret < 0)
    return ret;

  bufferlist data;
  ret \= cls\_cxx\_read(hctx, 0, size, data);
  if (ret < 0)
    return ret;

  byte digest\[AES::BLOCKSIZE\];
  MD5().CalculateDigest(digest, (byte\*)data.c\_str(), data.length());

  out\-\>append(digest, sizeof(digest));
  return 0;
}

Before explaining the function _compute\_md5_, let’s see how a client would remotely invoke _compute\_md5_ to calculate the hash:

bufferlist input, output;
ioctx.exec("my\_obj", "my\_hash\_class", "compute\_md5", input, output);

Here the client runs the librados _exec_ method to invoke the _compute\_md5_ function remotely on the object named “my\_obj”. Note that the “my\_hash\_class” is a name that identifies the plugin (not shown in this tutorial), and may contain many functions that can be invoked remotely. Now, through the power of networking, and lots of hand waving, a client can invoke the _compute\_md5_ function above which will run remotely on the OSD storing the target object (these are lots of gory details about how this actually happens that are beyond the scope of this document). When the remote method is executed, it performs a transaction that atomically reads the object payload and computes the MD5 hash, all within the OSD process, avoiding any network transfer of object data. At the end of the _compute\_md5_ function the digest is written into the _out_ parameter that will be marshaled back to the client.

Now that is some pretty magical stuff right there. But, there are situations where the overhead of compiling C/C++ into a shared library–potentially with multiple target architectures–is too heavy weight. It’d be nice if we could inject and alter object interfaces on-the-fly. To address this need, we’ve created a mechanism for defining new object classes using the Lua scripting language, which I’ll describe next.

## Additional Resources: Object Class Development

While it was necessary to introduce the concept of object classes, unfortunately a full tutorial on the subject is not in the scope of this post. Located on github is a “Hello, World” example object class containing extensive documentation: [https://github.com/ceph/ceph/blob/master/src/cls/hello/cls\_hello.cc](https://github.com/ceph/ceph/blob/master/src/cls/hello/cls_hello.cc). This resource is a good starting point, and if you have questions, please do not hesitate to ask questions on the [Ceph mailing lists or IRC channels](http://ceph.com/resources/mailing-list-irc/).

# Dynamic Object Classes With Lua

In order to support dynamic generation of object interfaces, we’ve embedded the LuaJIT VM inside the OSD process. Why Lua, you may ask? The Lua language and its run-time are specifically designed as an embedded language, and when coupled with the LuaJIT virtual machine, near native performance can be achieved. Briefly, the current implementation expects a Lua script defining any number of functions to be sent to the OSD along with a client request that specifies which specific function in the script to execute. Now let’s dig into the details.

A Lua object class is an arbitrary Lua script containing at least one exported function handler that a client may invoke remotely. By building up a collection of handlers, new and interesting interfaces to objects can be constructed and dynamically loaded into a running RADOS cluster. The basic structure of a Lua object class is shown in the following code snippet:

\-- helper modules
\-- helper functions
\-- etc...

function helper()
end

function handler1(input, output)
  helper()
end

function handler2(input, output)
end

cls.register(handler1)
cls.register(handler2)

In the above Lua script any number of functions and modules can be used to support the behavior exported by the functions _handler1_ and _handler2_. A client can remotely execute any registered function, provide an arbitrary input, and receive an arbitrary output.

## Handler Registration

Object classes written in Lua may have many functions, only a subset of which are handlers available to be directly invoked by a client. In order to make a Lua function available, the function must be exported by registering it. This is done using the _cls.register_ function. The following code snippet illustrates how this works.

function helper()
  \-- help out with stuff
end

function thehandler(input, output)
  helper()
end

cls.register(thehandler)

In the above example _cls.register(thehandler)_ exports the function _thehandler_, making it available for clients to call. A client that attempts to call the _helper_ function (an unregistered function), will receive a return value of _\-ENOTSUPP_.

## Error Handling Semantics

In the previous section we presented an example object class method written in C++ that calculated the MD5 hash of an object. Returning to this example, notice that each operation on the object is carefully checked for failure, and an error code is returned if any operation fails. When a negative value is returned from an object class handler the current transaction will be aborted, and the return value is passed back to the client. When the handler has completed successfully a return value of zero will commit the transaction. While in C++ we must perform these checks explicitly, in Lua this common pattern for handling errors can be fully managed. Take as an example the following C++ object class handler:

int handle1(cls\_method\_context\_t hctx, bufferlist \*in, bufferlist \*out)
{
  int ret \= cls\_cxx\_create(hctx, true);
  if (ret < 0)
    return ret;
  ...
  return 0;
}

The handler _handle1_ will return _\-EEXIST_ if the object already exists (or any other error encountered when running _cls\_cxx\_create_), and return zero if the handler complete successfully. The same functionality can be constructed in Lua, but when error handling fits this common pattern of aborting automatically, the Lua object class run-time will automagically select the correct return value. For instance in the following example, _handle2_ and _handle3_ have identical semantics to _handle1_ defined above in C++.

function handle2(input, output)
  cls.create(true);
  return 0;
end

function handle3(input, output)
  cls.create(true);
end

cls.register(handle2)
cls.register(handle3)

Some operations return error codes that we may want to handle directly. For example, when retrieving a value from the object map, _\-`ENOENT`_ is used to indicate that the given key was not found. If the handler code can deal with this case (e.g. creating and initializing a new key), then it is simple enough to just return all other error codes. This exact scenario is shown in the following C++ handler, in which we abort on any error code that is not _\-ENOENT_.

int handle(cls\_method\_context\_t hctx, bufferlist \*in, bufferlist \*out)
{
  string key;
  ::decode(key, \*in);
  int ret \= cls\_cxx\_map\_get\_val(hctx, key, &bl);
  if (ret < 0 && ret !\= \-ENOENT)
    return ret;
  if (ret \=\= \-ENOENT) {
    /\* initialize new key \*/
  }
  ...
  return 0;
}

The same handler can be constructed in Lua as follows:

function handle(input, output)
  key \= input:str()
  ok, ret\_or\_val \= pcall(cls.map\_get\_val, key)
  if not ok then
    if ret\_or\_val ~\= \-cls.ENOENT then
      return ret\_or\_val
    else
      \-- initialize new key
    end
  end
  val \= ret\_or\_val
  ...
  return 0
end

The trick here is to call the _cls.map\_get\_val_ in protected mode via the Lua _pcall_ function, which prevents any errors from being automatically propagated to the caller, allowing our handler to examine the return value.

## Logging

An object class can write into the OSD log (e.g. /var/log/ceph/osd-0.log) to record debugging information using the _cls.log_ function. The function takes any number of arguments which are converted into strings and separated by spaces in the final output. If the first argument is numeric then it is interpreted as a log-level. If no log-level is specified a default log-level is used.

cls.log('hi')         \-- will log 'hi'
cls.log(0, 'ouch')    \-- log 'ouch' at log-level = 0
cls.log('foo', 'bar') \-- log 'foo bar'
cls.log(1)            \-- will log '1' at default log-level

Logging is useful in debugging script execution and can also be used to provide more detailed error information.

## Object Payload I/O

The payload data of an object can be read from and written to using the **_cls.read_** and _**cls.write**_ functions. Each function takes an offset and length parameter.

size, mtime \= cls.stat()
data \= cls.read(0, size)          \-- size bytes from offset 0
cls.write(0, data:length(), data) \-- length of data at offset 0

## Index Access

A key/value store supporting range queries (based on Google’s LevelDB) can be accessed using the _cls.map\_set\_val_ and _cls.map\_get\_val_ functions. A key can be any string and a value is a standard blob of any size.

function handler(input, output)
  cls.map\_set\_val("foo", input)
  data \= cls.map\_get\_val("foo")
  assert(data \=\= input)
end

## Additional Resources

The Lua object class facility is not yet in the mainline Ceph tree. The feature is located in the cls-lua branch, and can be checked out from github:

  git://github.com/ceph/ceph.git cls-lua

The normal procedures for building and installing Ceph from source apply, and the only dependency is that LuaJIT development libraries be installed. These dependencies are available on Ubuntu. In addition, more functionality than is listed in this post has been implemented, and a set of unit tests are available in the source tree demonstrating the the full range of features.

# Lua Client Libraries

Before we jump into the sample application, I’ll introduce two additional components that will make our life easier. The first is Lua bindings for librados, and the second is a Lua library that hides the details of serializing Lua scripts for execution within the OSD.

## lua-rados

Lua bindings for the librados client library are available on github at [https://github.com/noahdesu/lua-rados/](https://github.com/noahdesu/lua-rados/). Here we will provide a brief overview for context. Please consult the [full documentation](http://noahdesu.github.io/lua-rados/) for additional information. Ok, let’s jump right in. The following code snippet shows how to connect to a RADOS cluster:

local rados \= require "rados"

local cluster \= rados.create()
cluster:conf\_read\_file()
cluster:connect()

Next, open a client I/O context for a particular pool:

local ioctx \= cluster:open\_ioctx('data')

Now the Lua client can interact with objects, such as setting an extended attribute:

local name \= 'xattr key'
local data \= 'i am some important data'
ioctx:setxattr('my\_obj', name, data, #data)

Those are the basics of writing RADOS clients in Lua. Now, let’s run some remote scripts from a Lua client.

## cls-lua-client

The protocol for sending a script to an OSD is fairly simple, but is easily wrapped up in a convenience library. The cls-lua-client located on github at [https://github.com/noahdesu/cls-lua-client/](https://github.com/noahdesu/cls-lua-client/) does just that, building on top of the lua-rados library described in the previous section. Assuming that we have connected to a RADOS cluster and constructed an I/O context object, a remote Lua script can be executed as in the following example. First, let’s create a Lua string containing the script we want to execute.

local script \= \[\[
function say\_hello(input, output)
  output:append("Hello, ")
  if #input \=\= 0 then
    output:append("world")
  else
    output:append(input:str())
  end
  output:append("!")
end
cls.register(say\_hello)
\]\]

The script above will send to its output the string “Hello, world!” if the input is zero-length. Otherwise, it will reply with “Hello, <input>!”, where <input> is substituted with the input sent from the client. This can be remotely executed using the cls-lua-client library as follows:

local ret, outdata \= clslua.exec(ioctx, "oid", script, "say\_hello", "")
print(outdata)

local ret, outdata \= clslua.exec(ioctx, "oid", script, "say\_hello", "John")
print(outdata)

Executing this would produce the output:

Hello, world!
Hello, John!

Great, now we have all the pieces to start building a sample application!

# Example Application: Image Thumbnail Service

As a driving example we will construct a service on top of RADOS that stores and generates image thumbnails. The service is very simple, and has the following properties.

1. Writing an image into an object sets the “base” or “original” image data.
2. A thumbnail computed from the base image can be generated remotely inside the OSD.
3. The original image and any generated thumbnail can be retrieved.

In the following examples I’ll demonstrate the core of the service. In practice these routines would be added to a larger project or executable, and of course made more robust against errors and different edge case scenarios. A fully functional example of this service can be found in the cls-lua-client github project at [https://github.com/noahdesu/cls-lua-client/blob/master/examples/imgserv.lua](https://github.com/noahdesu/cls-lua-client/blob/master/examples/imgserv.lua).

## Storing an Image

To store an image in RADOS we first read it from a local file, and then write it to the object. In order to support storage and retrieval of different thumbnails, we record the location and size of an image blob in the object index under a key describing it. In this simple example writing an image sets its base image, so we store it under the key “original”.

function put(object, filename)
  \-- read in image blob from file
  local file \= io.open(filename, "rb")
  local img \= file:read("\*all")

  \-- write the blob into the object
  local size, offset \= #img, 0
  ioctx:write(object, img, size, offset)

  \-- record size/offset in the object index
  local loc\_spec \= size .. "@" .. offset
  ioctx:omapset(object, {
    original \= loc\_spec,
  })
end

## Reducing Round-trips

In the previous example two round-trips were required to 1) set the object data and 2) update the index. These can be done atomically in a single round-trip by using a co-designed interface, demonstrated in the following script:

function put\_smart(object, filename)
  \-- define the script to execute remotely
  local script \= \[\[
  function put(img)
 -- write the input blob
 local size, offset = #img, 0
 cls.write(offset, size, img)

 -- update the leveldb index
 local loc\_spec\_bl = bufferlist.new()
 local loc\_spec = size .. "@" .. offset
 loc\_spec\_bl:append(spec)
 cls.map\_set\_val("original", loc\_spec\_bl)
 end
 cls.register(store)
  \]\]

  \-- read the input image blob from the file
  local file \= io.open(filename, "rb")
  local img \= file:read("\*all")

  \-- remotely execute script with image as input
  clslua.exec(ioctx, object, script, "put", img)
end

The script reads the image from the file and sends the image as the input to a script which executes on the OSD, taking care of the write and index update at the same time. Neat!

## Retrieving an Image

To read a particular version of an image we need to look-up the offset and length for the target image blob stored in the object index. In the following example the index look-up and object read are performed remotely, and the image is returned to the client if it exists. In the next section I’ll show how the _spec_ string is stored, but for context it describes the specification for creating a thumbnail (e.g. 500×400 pixels).

function get(object, filename, spec)
  local script \= \[\[
  function get(input, output)
 -- lookup the location of the image given the spec
 local loc\_spec\_bl = cls.map\_get\_val(input:str())
 local size, offset = string.match(loc\_spec\_bl:str(), "(%d+)@(%d+)")

 -- read and return the image blob from the object
 out\_bl = cls.read(offset, size)
 output:append(out\_bl:str())
 end
 cls.register(get)
  \]\]

  \-- execute script remotely
  ret, img \= clslua.exec(ioctx, object, script, "get", spec)

  \-- write image to output file
  local file \= io.open(filename, "wb")
  file:write(img)
end

The image returned from the script is then written to the output file.

## Generating Thumbnails

Thumbnails are generated using Lua wrappers to [ImageMagick](http://www.imagemagick.org/) available on github at [https://github.com/leafo/magick](https://github.com/leafo/magick). A thumbnail is generated using the _magick.thumb_ function, passing in an image blob and a thumbnail specification string (e.g. 500×300 pixels). The script that runs remotely first reads the original image, computes the thumbnail, appends the thumbnail to the object payload, and then records the offset and size of the thumbnail in the object index under a key equal to the specification string.

function thumb(object, spec\_string)
  local script \= \[\[
  (\*local magick = require "magick"

 function get\_orig\_img()
 -- lookup the location of the original image
 local loc\_spec\_bl = cls.map\_get\_val("original")
 local size, offset = string.match(loc\_spec\_bl:str(), "(%d+)@(%d+)")

 -- read image into memory
 return cls.read(offset, size)
 end

 function thumb(input, output)
 -- apply thumbnail spec to original image
 local spec\_string = input:str()
 local blob = get\_orig\_img()
 local img = assert(magick.load\_image\_from\_blob(blob:str()))
 img = magick.thumb(img, spec\_string)

 -- append thumbnail to object
 local obj\_size = cls.stat()
 local img\_bl = bufferlist.new()
 img\_bl:append(img)
 cls.write(obj\_size, #img\_bl, img\_bl)

 -- save location in leveldb
 local loc\_spec = #img\_bl .. "@" .. obj\_size
 local loc\_spec\_bl = bufferlist.new()
 loc\_spec\_bl:append(loc\_spec)
 cls.map\_set\_val(spec\_string, loc\_spec\_bl)
 end

 cls.register(thumb)\*)
  \]\]

  clslua.exec(ioctx, object, script, "thumb", spec\_string)
end

And that’s it folks… on-the-fly custom RADOS object interfaces! Want to contribute? We are continually improving the Lua bindings and the internal Lua object class API and are always looking for feedback. Thanks for stopping by!

![](http://track.hubspot.com/__ptq.gif?a=268973&k=14&bu=http://ceph.com&r=http://ceph.com/rados/dynamic-object-interfaces-with-lua/&bvt=rss&p=wordpress)
