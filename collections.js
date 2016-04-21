Stims = new Mongo.Collection('stims');
Responses = new Mongo.Collection('responses');

TurkServer.partitionCollection(Responses);