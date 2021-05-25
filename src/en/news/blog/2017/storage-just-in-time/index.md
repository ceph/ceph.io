---
title: "Storage just in time"
date: "2017-01-03"
author: "admin"
tags: 
  - "planet"
---

Storage is one of the pillar of IT infrastructure which used to be dominated by big and costly storage appliances. As software defined storage becomes commonplace, we now have the opportunity to apply [just-in-time](https://en.wikipedia.org/wiki/Just-in-time_manufacturing) principles to the storage world. This is what I will go through in this article.

### History

Since the early 2000s big storage boxes have been the bread and butter of the storage admins. Storage boxes would usually take the form of a pair of controllers and you would add a number of shelves as you grow. To get more capacity you would buy a whole new storage shelf: 12, 24 or 48 drives at a time.

This is usually a long process: planning, negotiations with the vendor, financial approval and installation - it could take months until the capacity is available. In many cases that means a multi year capacity planning and _just in case_ over-provisioning.

### Here comes Ceph

One of the principe of just-in-time is to keep as little stock as possible. In a storage system, the stock is the available capacity, so the objective is to reduce the overhead by reducing the available capacity. Of course, we will keep _some_ capacity on hands for rainy days and order more capacity as we need it.

From here the question becomes when do we need more capacity and how much? This depends on your business, but let me show you a generic example.

In a 200 TB - 8 nodes cluster, if we want to tolerate 1 node failure, we need 25 TB (12.5%) available capacity for auto-healing. Going below that is risking a full cluster in case of a node failure.

Since Ceph scales out on commodity hardware, servers and drives are readily available. It should take a couple of days to a week from order to the datacenter. I assume a 20 TB (10%) month to month data growth (5 TB (2.5%) week to week).

That means that when we reach 30 TB (15%) available we should trigger a new order.

The size of the order depends on how long you want it to last. In this example:

- 5 TB (2.5%) would last ~1 week (52 orders per year)
- 10 TB (5%) would last ~2 weeks (26 orders per year)
- 20 TB (10%) would last ~1 month (12 orders per year)
- 60 TB (30%) would last ~3 months (4 orders per year)

![just in time graph](http://www.root314.com/img/posts/just-in-time.svg)

### Benefits

Firstly, the most obvious benefit is the delay. The capacity purchase is delayed to when it is needed, reducing the initial investment ([CapEx](https://en.wikipedia.org/wiki/Capital_expenditure)). This is particularly helpful when usage patterns are not predictable, like a public cloud or a large private cloud.

Secondly, with just-in-time the storage system **always operates at an efficient usage level**. Since we buy equipment as we need it, we also:

- power it as we need it, therefore reducing the power consumption
- start the warranty as we need it, therefore having a more effective warranty coverage

The other benefits are directly related to [Moore’s Law](https://en.wikipedia.org/wiki/Moore's_law). As time goes you get access to newer equipment: bigger drives, more efficient CPUs, faster RAMs etc… Since you buy just-in-time you have access to technology that may not have been available at the time of initial deployment. This comes hand in hand with better prices - as the new generation of parts comes out the current generation becomes cheaper. Therefore you have a choice: you can buy the new generation part or the cheaper part based on your requirements.

### Next steps

Just-in-time works hand in hand with monitoring and automation, we could even imagine automatic orders triggered by the monitoring system. Exciting!

You can experiment with the calculator below to see how just-in-time methodology would fit into your environment.

#### Cluster

Nodes in the cluster (in units)

Node failures tolerated (in units)

Cluster capacity (in TB)

Monthly growth (in % of cluster capacity)

#### Supply chain

Delivery time (in days)

Orders per year

### Results

- Auto-healing reservation: TB (%)
- Order threshold: TB (%)
- Size of each order: TB (%)

[//ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js](//ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js)

angular.module('Root314', \[\]) .controller('CalculatorController', \['$scope', function($scope) {

$scope.nodes = 8; $scope.failures = 1; $scope.delivery = 7; $scope.capacity = 200; $scope.growth = 10; $scope.orders = 26;

$scope.max = function() { return 1-($scope.nodes-$scope.failures)/$scope.nodes; }; $scope.delivery\_growth = function() { return $scope.growth/100\*$scope.delivery/30; }; $scope.order\_size = function() { return 12\*$scope.growth/100/$scope.orders; }; }\]);

Source: Maxime Guyot ([Storage just in time](http://www.root314.com/ceph/2017/01/03/Storage-just-in-time/))
