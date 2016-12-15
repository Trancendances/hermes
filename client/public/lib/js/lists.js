var listsNumber = 0;

function getLists() {
    $.ajax({
        method: 'GET',
        url: 'lists',
        dataType: 'json',
        success: function(data) {
            listsNumber = data.length;
            if(data.length) {
                data.forEach(function(list) {
                    createRow(list.name);
                });
                addListeners();
            }
            else {
                let row = '<tr><td>No list found</td><td></td></tr>';
                $('#lists tbody').append(row);
            }
        }
        // TODO: error callback
    });
}


function createList() {
    $.ajax({
        method: 'POST',
        url: 'lists',
        data: {
            name: $('#name').val()
        },
        success: function() {
            if(!listsNumber) {
                $('#lists tr')[$('#lists tr').length - 1].remove();
            }
            $('#createlist').removeClass('btn-info');
            $('#createlist').addClass('btn-success');
            $('#createlist').val('List created!');
            createRow($('#name').val());
            listsNumber++;
        },
        error: function(xhr) {
            $('#createlist').removeClass('btn-info');
            $('#createlist').addClass('btn-danger');
            let val = 'An error occured (';
            val += xhr.responseJSON.err;
            val += '), creation aborted.'
            $('#createlist').val(val);
        }
    });
}


function removeList(name, row) {
    $.ajax({
        method: 'DELETE',
        url: 'lists/' + name,
        success: function() {
            row.remove();
            listsNumber--;
            if(!listsNumber) {
                let row = '<tr><td>No list found</td><td></td></tr>';
                $('#lists tbody').append(row);
            }
        }
        // TODO: error callback
    });
}


function addListeners() {
    $('.fa-times').on('click', function(e) {
        let row = e.target.parentNode.parentNode;
        let name = row.children[0].innerHTML;
        removeList(name, row);
    });
}


function genFaHtml(operations) {
    let fa = '';
    
    operations.forEach(function(operation) {    
        fa += '<i class="fa fa-' + operation + '" style="cursor:pointer"></i>&nbsp;';
    });
    return fa;
}


function createRow(name) {
    let operations = [
        'pencil', // Edit
        'times'   // Delete
    ];
    let row = '<tr><td>' + name + '</td><td>' + genFaHtml(operations) + '</tr>';
    $('#lists tbody').append(row);
}



$(document).ready(function() {
    getLists();
    $('#createlist').on('click', function() {
        if($('#name').val()) {
            // Changing the button style
            $('#createlist').removeClass('btn-danger');
            $('#createlist').removeClass('btn-primary');
            $('#createlist').addClass('btn-info');
            $('#createlist').val('Creating...');
            // Send mail
            createList();
        } else {
            $('#createlist').removeClass('btn-info');
            $('#createlist').addClass('btn-warning');
            $('#createlist').val('Please fill the name.');
        }
    });
});