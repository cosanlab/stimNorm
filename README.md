# Stim Norm  

Quick Meteor application that allows users to add a list of files (e.g. pictures, text) and collect information about them (e.g. ratings, labels) from users on Mechanical Turk.  

Currently this is not *at all* modular and only works with a single kind of stimulus (text) in a predetermined JSON format (highly nested dictionary). See the roadmap below for how this will be expanded (if/when I have time).  

#### Roadmap
- UI based file uploading system, with autoconversion to mongodb ([example](https://themeteorchef.com/snippets/importing-csvs/))
- Template picker that alters how stims are displayed to a user
- Question picker that allows developer to choose what kind of information they want to collect from a user
