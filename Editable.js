function Editable(divId){
    var $that = this;
    this.container = $('#' + divId);
    this.label = $('<label class="col-sm-3 control-label">');
    this.detailsContainer = $('<div class="col-lg-9">');
    this.detailsGroupControl = $('<div class="input-group asset-group-control">');
    this.details = $('<div class="asset-group-form-control">');
    this.input;
    this.select2;
    this.select2Container;
    this.detailsBtnGroup = $('<span class="input-group-btn">');
    this.detailsBtnEdit = $('<button class="btn btn-default">')
        .append(
            $(document.createElement('span'))
                .addClass('fa fa-pencil-square-o')
        );
    this.detailsBtnSave = $('<button class="btn btn-success">')
        .append(
            $(document.createElement('span'))
                .addClass('fa fa-floppy-o')
        );

    this.Initialize = function(){
        // Input Select2
        if(this.container.attr('data-db-id')) {
            this.input = $('<select id="' + this.container.attr('id') + 'Select2" class="form-control"></select>');
        }
        // All other inputs
        else {
            this.input = $('<input type="text" class="form-control form-control-editable">');
            this.input.val(this.container.attr('data-db-text'));
        }

        this.container.addClass('form-group');
        this.label.text(this.container.attr('data-name'));
        this.details.html(this.AddEditableText(this.container.attr('data-db-text')));

        this.detailsBtnSave.hide();

        this.container.append(this.label);
        this.container.append(this.detailsContainer);
        this.detailsContainer.append(this.detailsGroupControl);
        this.detailsGroupControl.append(this.input);
        this.detailsGroupControl.append(this.details);
        this.detailsGroupControl.append(this.detailsBtnGroup);
        this.detailsBtnGroup.append(this.detailsBtnEdit);
        this.detailsBtnGroup.append(this.detailsBtnSave);

        if(this.container.attr('data-db-id')) {
            this.select2 = $(this.input).select2({
                theme: "bootstrap",
                ajax: {
                    url: "/cbc/Asset/" + this.container.attr('data-action-name'),
                    dataType: 'json',
                    delay: 250,
                    type: 'post',
                    data: function (params) {
                        return {
                            query: params.term
                        };
                    },
                    processResults: function (data, page) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    text: item.Text,
                                    id: item.Id
                                }
                            })
                        };
                    },
                    cache: false
                },
                escapeMarkup: function (markup) { return markup; },
                tags: true
            });
            this.select2Container = $(this.select2).next();
        }

        this.detailsBtnEdit
            .mouseenter(function () {
                $that.details.addClass("asset-group-form-control-hover");
            })
            .mouseleave(function () {
                $that.details.removeClass("asset-group-form-control-hover");
            });

        this.detailsBtnEdit.click(function(){
            $that.OpenEditing();
        })

        this.detailsBtnSave.click(function(){
            $that.Save();
        })

        $(document)
            .click(function(event) {
                if($that.input.is(":visible")){
                    if(!$(event.target).closest($($that.detailsGroupControl)).length){
                        $that.CloseEditing();
                    }
                };
            });

        $(document).keyup(function (e) {
            if($that.input.is(":visible")){
                if (e.keyCode === 13) {
                    $that.Save();
                }
                if (e.keyCode === 27) {
                    $that.CloseEditing();
                }
            }
        });

        this.CloseEditing();
    };

    this.AddEditableText = function(text){
        if(text){
            return text;
        }

        return '&nbsp';
    };

    this.OpenEditing = function(){
        this.detailsBtnEdit.hide();
        this.detailsBtnSave.show();

        if(this.container.attr('data-db-id')) {
            this.details.hide();
            this.select2Container.show();
            this.select2.select2("open");
        }
        else{
            this.details.hide();
            this.input.show();
        }
    };

    this.CloseEditing = function(){
        this.detailsBtnSave.hide();
        this.detailsBtnEdit.show();

        if(this.container.attr('data-db-id')) {
            this.select2Container.hide();
            this.select2.select2("close");
            this.details.show();
        }

        else{
            this.details.removeClass("asset-group-form-control-hover");

            this.input.hide();
            this.details.show();
        }
    };

    this.Save = function(){
        console.log('save!');
        this.CloseEditing();
    }
}