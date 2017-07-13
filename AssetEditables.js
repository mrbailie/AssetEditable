function AssetEditables() {
    var $that = this;
    this.editables = [];

    this.Initialize = function () {
        console.log('init asset editables!');
        var $that = this;
        $('.asset-editable').each(function (index) {
            if ($(this).data('db-id')) {
                /*console.log('asset has a db-id field')*/
            }
            var editable = new Editable($(this).attr('id'));
            editable.Initialize();

            $that.editables.push(editable, $that);
        });
    }
}