Stims = new Mongo.Collection('stims');
Responses = new Mongo.Collection('responses');
Counter = new Mongo.Collection('counter');
TurkServer.partitionCollection(Responses);