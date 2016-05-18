Stims = new Mongo.Collection('stims');
Responses = new Mongo.Collection('responses');
Counter = new Mongo.Collection('counter');
Labels = new Mongo.Collection('labels');
TurkServer.partitionCollection(Responses);