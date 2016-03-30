/* 
    This script is a halndler for the qualification form on the home page, check addQualification.html 
    This script is loaded via app.js
*/

var subjects = [];
var unis = [];

$('#qualification_form #type').change(function() {
    var type = $(this).val();
    switch (type) {
        case 'school':
            if($('#type_university').is(':visible'))
                $('#type_university').hide(250);
            if($('#type_school').is(':hidden'))
                $('#type_school').show(250);
            if($('#qualification_form_errors').is(':visible'))
                $('#qualification_form_errors').html('').hide(250);
            break;
        case 'university':
            if($('#type_school').is(':visible'))
                $('#type_school').hide(250);
            if($('#type_university').is(':hidden'))
                $('#type_university').show(250);
            if($('#qualification_form_errors').is(':visible'))
                $('#qualification_form_errors').html('').hide(250);
            // load university in uni_name select form
            $.get('partials/functions/getResource.php?type=universities', function(data){
                if(data.status != 0){
                    var html = '';
                    for(i = 0; i < data.universities.length; i++){
                        html += '<option value='+data.universities[i].id+'>'+data.universities[i].name+'</option>';
                    }
                    $('#uni_name').append(html);
                }else{
                    $('#qualification_form_errors').html(data.error).show(250);
                }
            })
            break;
    }
});

$(document).ready(function(){
    $.get('partials/functions/getResource.php?type=subjects', function(data){
        if(data.status != 0){
            subjects = data.subjects;
        }else{
            $('#qualification_form_errors').html(data.error).show(250); 
        }  
    })
})

$('#qualification_form #t_subjects').change(function(){
    var t = $(this).val();
    var html = '';
    for(var i = 1; i <= t; i++){
        html += '<div class="form-group">';
        html += '<label class="col-sm-4 control-label" for="subject_name_'+i+'">Subject '+i+'</label>';
        html += '<div class="col-sm-4 col-xs-12">';
        html += '<select id="subject_name_'+i+'" name="subject_name_'+i+'" class="form-control">';
        html += '<option selected="true" disabled style="display:none;">Choose a subject</option>';
        for(var j = 0; j < subjects.length; j++){
            html += '<option value="'+subjects[j].subject_id+'">'+subjects[j].subject_name+'</option>';
        }
        html += '</select></div></div>';
        html += '<div class="form-group">';
        html += '<div class="col-sm-4 col-sm-offset-4 col-xs-12">';
        html += '<input type="number" min="0" max="100" id="subject_score_'+i+'" name="subject_score_'+i+'" class="form-control" placeholder="Subject score"></input>';
        html += '</div></div>';
    }
    html += '<div class="row"><div class="col-sm-4 col-sm-offset-4 col-xs-12"><span help-block">If your subject is not present, please choose a similar subject. If you have grades, then choose the avarage of the extremes of your grade, for e.g. A would be 85 (because extremes are 80~90)</span></div></div>';
    $('#subject_form_group').html(html);
    if($('#subject_form_group').is(':hidden'))
        $('#subject_form_group').show(250);
    $( "#qualification_submit" ).prop( "disabled", false );
})

$(document).on('click',"#qualification_cancel",function(){
    event.preventDefault();
    $('#add_qualification').slideUp(250, function(){
        $('#add_qualification').html('');
    });
})

$(document).on('click',"#qualification_submit",function(){
    event.preventDefault();
    var type = $('#qualification_form #type').val();
    var postData = $('#qualification_form').serializeArray();
    switch(type){
        case 'school':
            postData.push({"name":"table","value":"user_school_qualification"});
            $.post('partials/functions/addInfo.php', postData, function(data){
                if(data.status != 0){
                    if($('#qualification_form_errors').is(':visible'))
                        $('#qualification_form_errors').hide(250);
                    $('#add_qualification').slideUp(250, function(){
                        $('#add_qualification').html('');
                    });
                }else{
                    $('#qualification_form_errors').html(data.error).show(250); 
                }
            })
        break;
        case 'university':
        break;
    }
})