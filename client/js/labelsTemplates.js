Template.labelsLeft.events({
	'click .fa':function(event){
		var val = $(event.currentTarget).attr('id');
		var data = Labels.findOne(val);
		displayModal(Template.labelInfo,data);
	}
});

function displayModal(template,data, options) {
  // minimum options to get message to show
  options = options || { message: " " };
  var dialog = bootbox.alert(options);

  // Take out the default body that bootbox rendered
  dialog.find(".bootbox-body").remove();
  Blaze.renderWithData(template, data,dialog.find(".modal-body")[0]);
  return dialog;
}