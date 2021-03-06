/* 
    This script is a halndler for the qualification form on the home page, check addQualification.html 
    This script is loaded via app.js
*/

var subjects = [];

$(document).ready(function(){
    $.get('partials/functions/getResource.php?type=subjects', function(data){
        if(data.status != 0){
            subjects = data.subjects;
        }else{
            $('#qualification_form_errors').html(data.error).show(250); 
        }  
    })

})

$(document).on('change','#qualification_form #type',function() {
    var type = $(this).val();
    switch (type) {
        case 'school':
            loadForm('#type_school','#type_university','#type_job',false);
            break;
        case 'university':
            loadForm('#type_university','#type_job','#type_school',false);
            // load university in uni_name select form
            $.get('partials/functions/getResource.php?type=universities', function(data){
                if(data.status != 0){
                    var html = '<option selected="true" disabled style="display:none;">Select a university</option>';
                    for(i = 0; i < data.universities.length; i++){
                        html += '<option value='+data.universities[i].id+'>'+data.universities[i].name+'</option>';
                    }
                    $('#uni_name').html(html);
                }else{
                    $('#qualification_form_errors').html(data.error).show(250);
                }
               // render programme options
                $.get('partials/functions/getResource.php?type=qualification_types',function(data){
                    if(data.status != 0){
                        var html = '<option selected="true" disabled style="display:none;">Choose a qualification type</option>';
                        var types = data.qualification_types;
                        for(i = 0; i < types.length; i++){
                            html += '<option value='+types[i].type+'>'+types[i].type+'</option>';
                        }
                        $('#type_university #qual_type').html(html);
                    }else{
                        $('#qualification_form_errors').html(data.error).show(250); 
                    }
                })
            })
            break;
        case 'job':
            loadForm('#type_job','#type_university','#type_school',false);
            // load up jobs in the form
            $.get('partials/functions/getResource.php?type=jobs',function(data){
            var html = '';
            if(data.status != 0){
                html = '<option selected="true" disabled style="display:none;">Select your job</option>';
                var jobs = data.jobs;
                for(i = 0; i < jobs.length; i++){
                    html += '<option value='+jobs[i].id+'>'+jobs[i].title+'</option>';
                }
                $('#type_job #job').html(html);
            }else{
                $('#qualification_form_errors').html(data.error).show(250); 
            }
            html = '<option selected="true" disabled style="display:none;">field of your job</option>'
            for(i = 0; i < subjects.length; i++){
                html += '<option value="'+subjects[i].subject_id+'">'+subjects[i].subject_name+'</option>';
            }
            $('#type_job #subject').html(html);
        })
    }
});

/* This function loads shows divs based on their ids
    a: #elementID to show
    b: #elementID to hide
    c: #elementID to hide
    d: if qualification submit button shoulb be disabled on load or not
    d: true for set it to disabled, false for opposite.
*/

function loadForm(a,b,c,d){
    if($(b).is(':visible'))
        $(b).hide(250);
    if($(c).is(':visible'))
        $(c).hide(250);
    if($(a).is(':hidden'))
        $(a).show(250);
    if($('#qualification_form_errors').is(':visible'))
        $('#qualification_form_errors').html('').hide(250);
    $( "#qualification_submit" ).prop( "disabled", d);
}

// Render the qualifications after selection of a type.
$(document).on('change','#type_university #qual_type', function(){
    var type = $(this).val();
        // Render qualifications
        $.get('partials/functions/getResource.php?type=qualifications',function(data){
            if(data.status != 0){
                var html = '<option selected="true" disabled style="display:none;">Select your qualification</option>';
                for(i = 0; i < data.qualifications.length; i++){
                    if(data.qualifications[i].type === type)
                        html += '<option value="'+data.qualifications[i].id+'">'+data.qualifications[i].name+' | '+data.qualifications[i].short_title+'</option>';
                }
                $('#type_university #qualification').html(html);
                html = '<option selected="true" disabled style="display:none;">field of your qualification</option>';
                for(i = 0; i < subjects.length; i++){
                    html += '<option value="'+subjects[i].subject_id+'">'+subjects[i].subject_name+'</option>';
                }
                $('#type_university #subject').html(html);
            }else{
                $('#qualification_form_errors').html(data.error).show(250); 
            }
            if($('#qualification_select').is(':hidden'))
            $('#qualification_select').show(250);
        })
})

// If it's GCSE/S4 then no need of taking the subjects
$(document).on('change','#qualification_form #type_school #qualification',function(){
    var q = $(this).val();
    if(q <= 1){
        if($('#t_subjects_div').is(':visible'))
            $('#t_subjects_div').hide(250);
        if($('#subject_form_group').is(':visible'))
            $('#subject_form_group').hide(250);
        $( "#qualification_submit" ).prop( "disabled", false );
    }else{
        if($('#t_subjects_div').is(':hidden'))
            $('#t_subjects_div').show(250);
        $( "#qualification_submit" ).prop( "disabled", true );
    }
})

$(document).on('change','#qualification_form #t_subjects',function(){
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
        html += '<input type="text" id="subject_score_'+i+'" name="subject_score_'+i+'" class="form-control" placeholder="Subject grade"></input>';
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
    postData.push({"name":"table","value":type});
    $.post('partials/functions/addInfo.php', postData, function(data){
        if(data.status != 0){
            if($('#qualification_form_errors').is(':visible'))
                $('#qualification_form_errors').hide(250);
            $('#add_qualification').slideUp(250, function(){
                $('#add_qualification').html('');
            });
            updateQualifications();
        }else{
            $('#qualification_form_errors').html(data.error).show(250); 
        }
    })
})