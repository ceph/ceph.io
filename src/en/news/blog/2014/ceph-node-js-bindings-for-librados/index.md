---
title: "Ceph Node.js Bindings for Librados"
date: "2014-08-25"
author: "laurentbarbe"
tags: 
---

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
</pre></td><td class="code"><pre><code class="js"><span class="line"><span class="kd">var</span> <span class="nx">cluster</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">rados</span><span class="p">.</span><span class="nx">Rados</span><span class="p">(</span> <span class="s2">"ceph"</span><span class="p">,</span> <span class="s2">"client.admin"</span><span class="p">,</span> <span class="s2">"/etc/ceph/ceph.conf"</span><span class="p">);</span>
</span><span class="line"><span class="nx">cluster</span><span class="p">.</span><span class="nx">connect</span><span class="p">();</span>
</span><span class="line">
</span><span class="line"><span class="kd">var</span> <span class="nx">ioctx</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">rados</span><span class="p">.</span><span class="nx">Ioctx</span><span class="p">(</span><span class="nx">cluster</span><span class="p">,</span> <span class="s2">"data"</span><span class="p">);</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">aio_write</span><span class="p">(</span><span class="s2">"testfile2"</span><span class="p">,</span> <span class="k">new</span> <span class="nx">Buffer</span><span class="p">(</span><span class="s2">"1234567879ABCD"</span><span class="p">),</span> <span class="mi">14</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">err</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">  <span class="k">if</span> <span class="p">(</span><span class="nx">err</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">    <span class="k">throw</span> <span class="nx">err</span><span class="p">;</span>
</span><span class="line">  <span class="p">}</span>
</span><span class="line">  <span class="p">...</span>
</span></code></pre></td></tr></tbody></table>

To my knowledge, there is not yet any wrapper Node.js for librados. (I guess that Alexandre has not found again the code it had begun. [http://tracker.ceph.com/issues/4230](http://tracker.ceph.com/issues/4230)). So, I started to make a draft of a plugin (when I have some time). For now I am not using it, but it allows me to discover Node. If people are interested this is here :

[https://github.com/ksperis/node-rados](https://github.com/ksperis/node-rados)

(suggestions are welcome, especially on the Error Handling, the use of libuv, buffers / strings, and everything else…)

All is not yet implemented, but the basic functions are present.

For example (example.js file in repo):

<table><tbody><tr><td class="gutter"><pre class="line-numbers"><span class="line-number">1</span>
<span class="line-number">2</span>
<span class="line-number">3</span>
<span class="line-number">4</span>
<span class="line-number">5</span>
<span class="line-number">6</span>
<span class="line-number">7</span>
<span class="line-number">8</span>
<span class="line-number">9</span>
<span class="line-number">10</span>
<span class="line-number">11</span>
<span class="line-number">12</span>
<span class="line-number">13</span>
<span class="line-number">14</span>
<span class="line-number">15</span>
<span class="line-number">16</span>
<span class="line-number">17</span>
<span class="line-number">18</span>
<span class="line-number">19</span>
<span class="line-number">20</span>
<span class="line-number">21</span>
<span class="line-number">22</span>
<span class="line-number">23</span>
<span class="line-number">24</span>
<span class="line-number">25</span>
<span class="line-number">26</span>
<span class="line-number">27</span>
<span class="line-number">28</span>
<span class="line-number">29</span>
<span class="line-number">30</span>
<span class="line-number">31</span>
<span class="line-number">32</span>
<span class="line-number">33</span>
<span class="line-number">34</span>
<span class="line-number">35</span>
<span class="line-number">36</span>
<span class="line-number">37</span>
<span class="line-number">38</span>
<span class="line-number">39</span>
<span class="line-number">40</span>
<span class="line-number">41</span>
<span class="line-number">42</span>
<span class="line-number">43</span>
<span class="line-number">44</span>
<span class="line-number">45</span>
<span class="line-number">46</span>
<span class="line-number">47</span>
<span class="line-number">48</span>
<span class="line-number">49</span>
<span class="line-number">50</span>
<span class="line-number">51</span>
<span class="line-number">52</span>
<span class="line-number">53</span>
<span class="line-number">54</span>
<span class="line-number">55</span>
<span class="line-number">56</span>
<span class="line-number">57</span>
<span class="line-number">58</span>
<span class="line-number">59</span>
<span class="line-number">60</span>
<span class="line-number">61</span>
<span class="line-number">62</span>
<span class="line-number">63</span>
<span class="line-number">64</span>
<span class="line-number">65</span>
<span class="line-number">66</span>
<span class="line-number">67</span>
<span class="line-number">68</span>
<span class="line-number">69</span>
<span class="line-number">70</span>
<span class="line-number">71</span>
<span class="line-number">72</span>
<span class="line-number">73</span>
<span class="line-number">74</span>
<span class="line-number">75</span>
<span class="line-number">76</span>
<span class="line-number">77</span>
<span class="line-number">78</span>
<span class="line-number">79</span>
<span class="line-number">80</span>
<span class="line-number">81</span>
<span class="line-number">82</span>
<span class="line-number">83</span>
<span class="line-number">84</span>
<span class="line-number">85</span>
<span class="line-number">86</span>
<span class="line-number">87</span>
<span class="line-number">88</span>
<span class="line-number">89</span>
<span class="line-number">90</span>
<span class="line-number">91</span>
<span class="line-number">92</span>
<span class="line-number">93</span>
<span class="line-number">94</span>
<span class="line-number">95</span>
<span class="line-number">96</span>
<span class="line-number">97</span>
<span class="line-number">98</span>
<span class="line-number">99</span>
<span class="line-number">100</span>
<span class="line-number">101</span>
<span class="line-number">102</span>
<span class="line-number">103</span>
<span class="line-number">104</span>
<span class="line-number">105</span>
<span class="line-number">106</span>
<span class="line-number">107</span>
<span class="line-number">108</span>
<span class="line-number">109</span>
<span class="line-number">110</span>
<span class="line-number">111</span>
<span class="line-number">112</span>
<span class="line-number">113</span>
<span class="line-number">114</span>
<span class="line-number">115</span>
<span class="line-number">116</span>
<span class="line-number">117</span>
<span class="line-number">118</span>
<span class="line-number">119</span>
<span class="line-number">120</span>
<span class="line-number">121</span>
<span class="line-number">122</span>
<span class="line-number">123</span>
<span class="line-number">124</span>
<span class="line-number">125</span>
<span class="line-number">126</span>
<span class="line-number">127</span>
<span class="line-number">128</span>
<span class="line-number">129</span>
<span class="line-number">130</span>
<span class="line-number">131</span>
</pre></td><td class="code"><pre><code class="js"><span class="line"><span class="kd">var</span> <span class="nx">rados</span> <span class="o">=</span> <span class="nx">require</span><span class="p">(</span><span class="s1">'./build/Release/rados'</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="c1">// EXEMPLE FILE</span>
</span><span class="line">
</span><span class="line"><span class="c1">//==================================</span>
</span><span class="line"><span class="c1">//     Connect to cluster</span>
</span><span class="line"><span class="c1">//==================================</span>
</span><span class="line"><span class="kd">var</span> <span class="nx">cluster</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">rados</span><span class="p">.</span><span class="nx">Rados</span><span class="p">(</span> <span class="s2">"ceph"</span><span class="p">,</span> <span class="s2">"client.admin"</span><span class="p">,</span> <span class="s2">"/etc/ceph/ceph.conf"</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="kd">var</span> <span class="nx">err</span> <span class="o">=</span> <span class="nx">cluster</span><span class="p">.</span><span class="nx">connect</span><span class="p">();</span>
</span><span class="line"><span class="k">if</span> <span class="p">(</span><span class="nx">err</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">  <span class="c1">// On connection error</span>
</span><span class="line">  <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="s2">"Error "</span> <span class="o">+</span> <span class="nx">err</span><span class="p">);</span>
</span><span class="line">  <span class="k">throw</span> <span class="nx">err</span><span class="p">;</span>
</span><span class="line"><span class="p">}</span>
</span><span class="line">
</span><span class="line"><span class="c1">// Print cluster FSID, pools</span>
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span> <span class="s2">"fsid : "</span> <span class="o">+</span> <span class="nx">cluster</span><span class="p">.</span><span class="nx">get_fsid</span><span class="p">()</span> <span class="p">);</span>
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span> <span class="s2">"ls pools : "</span> <span class="o">+</span> <span class="nx">cluster</span><span class="p">.</span><span class="nx">pool_list</span><span class="p">()</span> <span class="p">);</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="c1">//==================================</span>
</span><span class="line"><span class="c1">//     Create IOCTX</span>
</span><span class="line"><span class="c1">//==================================</span>
</span><span class="line"><span class="kd">var</span> <span class="nx">ioctx</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">rados</span><span class="p">.</span><span class="nx">Ioctx</span><span class="p">(</span><span class="nx">cluster</span><span class="p">,</span> <span class="s2">"data"</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="s2">" --- RUN Sync Write / Read --- "</span><span class="p">);</span>
</span><span class="line"><span class="c1">// Sync write_full</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">write_full</span><span class="p">(</span><span class="s2">"testfile1"</span><span class="p">,</span> <span class="k">new</span> <span class="nx">Buffer</span><span class="p">(</span><span class="s2">"01234567ABCDEF"</span><span class="p">));</span>
</span><span class="line">
</span><span class="line"><span class="c1">// Sync Read</span>
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span> <span class="s2">"Read data : "</span> <span class="o">+</span>
</span><span class="line">  <span class="nx">ioctx</span><span class="p">.</span><span class="nx">read</span><span class="p">(</span><span class="s2">"testfile1"</span><span class="p">,</span> <span class="nx">ioctx</span><span class="p">.</span><span class="nx">stat</span><span class="p">(</span><span class="s2">"testfile1"</span><span class="p">).</span><span class="nx">psize</span><span class="p">).</span><span class="nx">toString</span><span class="p">()</span> <span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="c1">// Remove</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">remove</span><span class="p">(</span><span class="s2">"testfile1"</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="s2">" --- RUN ASync Write / Read --- "</span><span class="p">);</span>
</span><span class="line"><span class="c1">// ASync write_full</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">aio_write</span><span class="p">(</span><span class="s2">"testfile2"</span><span class="p">,</span> <span class="k">new</span> <span class="nx">Buffer</span><span class="p">(</span><span class="s2">"1234567879ABCD"</span><span class="p">),</span> <span class="mi">14</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">err</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">  <span class="k">if</span> <span class="p">(</span><span class="nx">err</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">    <span class="k">throw</span> <span class="nx">err</span><span class="p">;</span>
</span><span class="line">  <span class="p">}</span>
</span><span class="line">
</span><span class="line">  <span class="nx">ioctx</span><span class="p">.</span><span class="nx">aio_read</span><span class="p">(</span><span class="s2">"testfile2"</span><span class="p">,</span> <span class="mi">14</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">err</span><span class="p">,</span> <span class="nx">data</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">  <span class="k">if</span> <span class="p">(</span><span class="nx">err</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">    <span class="k">throw</span> <span class="nx">err</span><span class="p">;</span>
</span><span class="line">  <span class="p">}</span>
</span><span class="line">
</span><span class="line">   <span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="s2">"[async callback] data = "</span> <span class="o">+</span> <span class="nx">data</span><span class="p">.</span><span class="nx">toString</span><span class="p">());</span>
</span><span class="line">
</span><span class="line">  <span class="p">});</span>
</span><span class="line">
</span><span class="line"><span class="p">});</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="c1">//==================================</span>
</span><span class="line"><span class="c1">//     Read / Write Attributes</span>
</span><span class="line"><span class="c1">//==================================</span>
</span><span class="line">
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="s2">" --- RUN Attributes Write / Read --- "</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">setxattr</span><span class="p">(</span><span class="s2">"testfile3"</span><span class="p">,</span> <span class="s2">"attr1"</span><span class="p">,</span> <span class="s2">"first attr"</span><span class="p">);</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">setxattr</span><span class="p">(</span><span class="s2">"testfile3"</span><span class="p">,</span> <span class="s2">"attr2"</span><span class="p">,</span> <span class="s2">"second attr"</span><span class="p">);</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">setxattr</span><span class="p">(</span><span class="s2">"testfile3"</span><span class="p">,</span> <span class="s2">"attr3"</span><span class="p">,</span> <span class="s2">"last attr value"</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="kd">var</span> <span class="nx">attrs</span> <span class="o">=</span> <span class="nx">ioctx</span><span class="p">.</span><span class="nx">getxattrs</span><span class="p">(</span><span class="s2">"testfile3"</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="s2">"testfile3 xattr = %j"</span><span class="p">,</span> <span class="nx">attrs</span><span class="p">);</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="c1">// destroy ioctx and close cluster after aio_flush</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">aio_flush_async</span><span class="p">(</span><span class="kd">function</span> <span class="p">(</span><span class="nx">err</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">  <span class="nx">ioctx</span><span class="p">.</span><span class="nx">destroy</span><span class="p">();</span>
</span><span class="line">  <span class="nx">cluster</span><span class="p">.</span><span class="nx">shutdown</span><span class="p">();</span>
</span><span class="line"><span class="p">});</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="nx">process</span><span class="p">.</span><span class="nx">exit</span><span class="p">(</span><span class="nx">code</span><span class="o">=</span><span class="mi">0</span><span class="p">)</span>
</span><span class="line">
</span><span class="line"><span class="c1">// OTHER EXEMPLES</span>
</span><span class="line">
</span><span class="line"><span class="c1">//   Read Sync file in chunks</span>
</span><span class="line"><span class="kd">var</span> <span class="nx">file</span> <span class="o">=</span> <span class="s2">"testfile"</span><span class="p">;</span>
</span><span class="line"><span class="kd">var</span>   <span class="nx">fileSize</span> <span class="o">=</span> <span class="nx">ioctx</span><span class="p">.</span><span class="nx">stat</span><span class="p">(</span><span class="nx">file</span><span class="p">).</span><span class="nx">psize</span><span class="p">,</span>
</span><span class="line">  <span class="nx">chunkSize</span> <span class="o">=</span> <span class="mi">512</span><span class="p">,</span>
</span><span class="line">    <span class="nx">bytesRead</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="k">while</span> <span class="p">(</span><span class="nx">bytesRead</span> <span class="o">&lt;</span> <span class="nx">fileSize</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">    <span class="k">if</span> <span class="p">((</span><span class="nx">bytesRead</span> <span class="o">+</span> <span class="nx">chunkSize</span><span class="p">)</span> <span class="o">&gt;</span> <span class="nx">fileSize</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">        <span class="nx">chunkSize</span> <span class="o">=</span> <span class="p">(</span><span class="nx">fileSize</span> <span class="o">-</span> <span class="nx">bytesRead</span><span class="p">);</span>
</span><span class="line">    <span class="p">}</span>
</span><span class="line">    <span class="kd">var</span> <span class="nx">buffer</span> <span class="o">=</span> <span class="nx">ioctx</span><span class="p">.</span><span class="nx">read</span><span class="p">(</span><span class="nx">file</span><span class="p">,</span> <span class="nx">chunkSize</span><span class="p">,</span> <span class="nx">bytesRead</span><span class="p">);</span>
</span><span class="line">    <span class="nx">bytesRead</span> <span class="o">+=</span> <span class="nx">chunkSize</span><span class="p">;</span>
</span><span class="line">    <span class="nx">process</span><span class="p">.</span><span class="nx">stdout</span><span class="p">.</span><span class="nx">write</span><span class="p">(</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">toString</span><span class="p">());</span>
</span><span class="line"><span class="p">}</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="c1">//   Read Async file in chunks</span>
</span><span class="line"><span class="kd">var</span> <span class="nx">file</span> <span class="o">=</span> <span class="s2">"testfile"</span><span class="p">;</span>
</span><span class="line"><span class="kd">var</span>   <span class="nx">fileSize</span> <span class="o">=</span> <span class="nx">ioctx</span><span class="p">.</span><span class="nx">stat</span><span class="p">(</span><span class="nx">file</span><span class="p">).</span><span class="nx">psize</span><span class="p">,</span>
</span><span class="line">  <span class="nx">chunkSize</span> <span class="o">=</span> <span class="mi">512</span><span class="p">,</span>
</span><span class="line">    <span class="nx">bytesRead</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="k">while</span> <span class="p">(</span><span class="nx">bytesRead</span> <span class="o">&lt;</span> <span class="nx">fileSize</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">    <span class="k">if</span> <span class="p">((</span><span class="nx">bytesRead</span> <span class="o">+</span> <span class="nx">chunkSize</span><span class="p">)</span> <span class="o">&gt;</span> <span class="nx">fileSize</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">        <span class="nx">chunkSize</span> <span class="o">=</span> <span class="p">(</span><span class="nx">fileSize</span> <span class="o">-</span> <span class="nx">bytesRead</span><span class="p">);</span>
</span><span class="line">    <span class="p">}</span>
</span><span class="line">    <span class="nx">ioctx</span><span class="p">.</span><span class="nx">aio_read</span><span class="p">(</span><span class="nx">file</span><span class="p">,</span> <span class="nx">chunkSize</span><span class="p">,</span> <span class="nx">bytesRead</span><span class="p">,</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">err</span><span class="p">,</span> <span class="nx">data</span><span class="p">)</span> <span class="p">{</span>
</span><span class="line">      <span class="nx">process</span><span class="p">.</span><span class="nx">stdout</span><span class="p">.</span><span class="nx">write</span><span class="p">(</span><span class="nx">data</span><span class="p">.</span><span class="nx">toString</span><span class="p">());</span>
</span><span class="line">    <span class="p">});</span>
</span><span class="line">    <span class="nx">bytesRead</span> <span class="o">+=</span> <span class="nx">chunkSize</span><span class="p">;</span>
</span><span class="line"><span class="p">}</span>
</span><span class="line">
</span><span class="line">
</span><span class="line"><span class="c1">//   Use snapshot</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">write_full</span><span class="p">(</span><span class="s2">"testfile10"</span><span class="p">,</span> <span class="k">new</span> <span class="nx">Buffer</span><span class="p">(</span><span class="s2">"version1"</span><span class="p">));</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">snap_create</span><span class="p">(</span><span class="s2">"snaptest1"</span><span class="p">);</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">write_full</span><span class="p">(</span><span class="s2">"testfile10"</span><span class="p">,</span> <span class="k">new</span> <span class="nx">Buffer</span><span class="p">(</span><span class="s2">"version2"</span><span class="p">));</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">snap_create</span><span class="p">(</span><span class="s2">"snaptest2"</span><span class="p">);</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">write_full</span><span class="p">(</span><span class="s2">"testfile10"</span><span class="p">,</span> <span class="k">new</span> <span class="nx">Buffer</span><span class="p">(</span><span class="s2">"version3"</span><span class="p">));</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">snap_create</span><span class="p">(</span><span class="s2">"snaptest3"</span><span class="p">);</span>
</span><span class="line">
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">snap_rollback</span><span class="p">(</span><span class="s2">"testfile10"</span><span class="p">,</span> <span class="s2">"snaptest2"</span><span class="p">);</span>
</span><span class="line"><span class="nx">console</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">ioctx</span><span class="p">.</span><span class="nx">read</span><span class="p">(</span><span class="s2">"testfile10"</span><span class="p">).</span><span class="nx">toString</span><span class="p">());</span>
</span><span class="line">
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">snap_remove</span><span class="p">(</span><span class="s2">"snaptest1"</span><span class="p">);</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">snap_remove</span><span class="p">(</span><span class="s2">"snaptest2"</span><span class="p">);</span>
</span><span class="line"><span class="nx">ioctx</span><span class="p">.</span><span class="nx">snap_remove</span><span class="p">(</span><span class="s2">"snaptest3"</span><span class="p">);</span>
</span></code></pre></td></tr></tbody></table>
