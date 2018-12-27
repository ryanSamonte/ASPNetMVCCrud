$(document).ready(function () {
    getList();
});

//Modal Events
$(document).on("hide.bs.modal", "#insertStudentInfoModal", function () {
    $("#lastnameInsert").val("");
    $("#firstnameInsert").val("");
    $("#ageInsert").val("");
    $("#subjectNameInsert").val("");
    $("#gradeInsert").val("");

    var t = $('#gradesTable').DataTable();

    t.clear().draw();
});

$(document).on("hide.bs.modal", "#viewStudentInfoModal", function () {
    var t = $('#gradesList').DataTable();

    t.clear().draw();
});

//DataTables Setup
$(document).ready(function () {
    $('#gradesTable').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#gradesList').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });
});


$(document).ready(function () {
    var table = $('#gradesTable').DataTable();

    $('#gradesTable tbody').on('click', '#removeBtn', function () {
        table
            .row($(this).parents('tr'))
            .remove()
            .draw();
    });
});

$(document).ready(function () {
    var t = $('#gradesTable').DataTable();

    $('#insertGrade').on('click', function () {
        if ($('#subjectNameInsert').val() == "" && $('#gradeInsert').val() == "") {
            //$.notify({
            //    icon: "pe-7s-close-circle",
            //    message: "Kindly fill-in the affected areas of the changes"

            //}, {
            //    type: 'danger',
            //    timer: 4000,
            //    placement: {
            //        from: "bottom",
            //        align: "right"
            //    }
            //});

            console.log("None");
        }
        else {
            t.row.add([
                $('#subjectNameInsert').val(),
                $('#gradeInsert').val(),
                    "test"
            ]).draw(false);
        }
    });
});


//Insert Data
$(document).on("click", "#insertButton", function () {
    $.ajax(
    {
        method: "POST", //HTTP POST Method
        url: "/Home/Save",
        data: {
            LastName: $("#lastnameInsert").val(),
            FirstName: $("#firstnameInsert").val(),
            Age: $("#ageInsert").val(),
            Grade: JSON.stringify(tableToJSON($("#gradesTable"))),
            __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#newInfoForm").val(),
        },
        success: function (da) {
            var table = $("#studentList").DataTable();
            $("#insertStudentInfoModal .close").click();
            table.destroy();
            getList();
        },
        error: function (da) {
            alert('Error encountered!');
        }
    });
});


//View Data
$(document).on("click", ".viewButton", function () {
    $("#viewStudentInfoModal").focus();

    var id = $(this).attr("data-id");

    $("#btnUpdate").attr("data-edit-id", id);

    var t = $('#gradesList').DataTable();

    $.ajax({
        type: "GET",
        url: "/Home/Edit?Id=" + id,
        success: function (data) {
            var jsonStringified = JSON.stringify(data);

            var studentDetails = JSON.parse(jsonStringified);

            var gradesDetails = JSON.parse(studentDetails.Grade);

            $("#lastnameView").val(studentDetails.LastName);
            $("#firstnameView").val(studentDetails.FirstName);
            $("#ageView").val(studentDetails.Age);

            var i;
            var result = {} ;
            for (i = 0; i < gradesDetails.length; i++) {
                var objectInResponse = gradesDetails[i];
                var subject = objectInResponse.Subject;
                var grade = objectInResponse.Grade;
                result[subject] = grade;

                t.row.add([
                    subject,
                    grade
                ]).draw(false);
            }
        },
        error: function () {
            alert("Error while retrieving data of :" + id);
        }
    });
});


//Edit Data
$(document).on("click", ".editButton", function () {
    $("#editStudentInfoModal").focus();

    var id = $(this).attr("data-id");

    $("#btnUpdate").attr("data-edit-id", id);

    $.ajax({
        type: "GET",
        url: "/Home/Edit?Id="+ id,
        success: function (data) {
            var jsonStringified = JSON.stringify(data);
            
            var studentDetails = JSON.parse(jsonStringified);

            $("#lastname").val(studentDetails.LastName);
            $("#firstname").val(studentDetails.FirstName);
            $("#age").val(studentDetails.Age);
        },
        error: function () {
            alert("Error while retrieving data of :" + id);
        }
    });
});

//Update Data
$(document).on("click", "#btnUpdate", function () {
        var id = $(this).attr("data-edit-id");

        $.ajax(
        {
            method: "POST", //HTTP POST Method
            url: "/Home/Update?Id=" + id,
            data: {
                LastName: $("#lastname").val(),
                FirstName: $("#firstname").val(),
                Age: $("#age").val(),
                __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#updateInfoForm").val(),
            },
            success: function (da) {
                var table = $("#studentList").DataTable();
                $("#editStudentInfoModal .close").click();
                table.destroy();
                getList();
            },
            error: function (da) {
                alert('Error encountered!');
            }
        });
});

//Delete Data
$(document).on("click", "#btnDelete", function () {
    var id = $(this).attr("data-id");
    var table = $("#studentList");
    var button = $(this);
    $.ajax(
    {
        method: "POST", //HTTP POST Method
        url: "/Home/Delete?Id=" + id,
        success: function (da) {
            if (confirm("Are you sure you want to delete?") == true) {
                redrawDt();
            }
        },
        error: function (da) {
            alert('Error encountered!');
        }
    });
});


//Functions
function redrawDt(){
    var table = $("#studentList").DataTable();

    table.row($("#btnDelete").parents("tr")).remove().draw();
}

function tableToJSON(tblObj) {
    var data = [];
    var $headers = $(tblObj).find("th");
    var $rows = $(tblObj).find("tbody tr").each(function (index) {
        $cells = $(this).find("td");
        data[index] = {};
        $cells.each(function (cellIndex) {
            data[index][$($headers[cellIndex]).html()] = $(this).html();
        });
    });
    return data;
}

function getList() {
    var table = $("#studentList").DataTable({
        ajax: {
            url: "/Home/ViewAll",
        dataSrc: "",
        },
        columns: [
            {
                data: "LastName"
            },
            {
                data: "FirstName"
            },
            {
                data: "Age"
            },
            {
                data: "Id",
                render: function (data) {

                    return "<input type='button' class='btn btn-success viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewStudentInfoModal' name='viewButton' id='btnView' value='View' style='width:100%;'/>";
                }
            },
            {
                data: "Id",
                render: function (data) {

                    return "<input type='button' class='btn btn-warning editButton' data-id=" + data + " data-toggle='modal' data-target='#editStudentInfoModal' name='editButton' id='btnEdit' value='Edit' style='width:100%;'/>";
                }
            },
            {
                data: "Id",
                render: function (data) {
                    return "<input type='button' class='btn btn-danger deleteButton' data-id=" + data + " name='deleteButton' id='btnDelete' value='Delete' style='width:100%;'/>";
                }
            }
        ]
    });
}