var $treeView;

function tableViewButton(data) {
    if (data.length>0)
        return `<button class="btn btn-outline-primary">View (${data.length})</button>`
    else
        return "---"
}

let state = {
    referrals: []
}

PERSON_HOME_URL = '/home'

var referralsTable = $("#table").DataTable({
    // "aaData": state.referrals,
    "columns": [
        {
            "data": "name",
            render: function(data, type, row, meta) {
                if (type == 'display') {
                    return `<a href='/${row.slug}'>${data}</a>`
                } else 
                    return data
            }
        },
        {
            "data": "phone"
        },
        {
            "data": "orders",
            render: function(data, type, row, meta) {
                if (type == 'display')
                    return tableViewButton(data)
                else
                    return data.length
            }
        },
        {
            "data": "referrals",
            render: function(data, type, row, meta) {
                if (type == 'display')
                    return tableViewButton(data)
                else
                    return data.length
            }
        },
        {
            "render": function(data, type, row, meta) {
                return "---"
            }
        },
        {
            "render": function(data, type, row, meta) {
                console.log(row)
                if (type == 'display' && !row.assigned_referrer) {
                    return `<button class='btn btn-outline-secondary'>Assign</button>`
                }
                else if (type == 'display') {
                    return "---"
                }
                else {
                    return row.assigned_referrer === null ? "Unassigned" : "Assigned"
                }
            }
        }
    ]
})

if (API_HOST && PERSON_ID) {
    $.ajax({
        type: "GET",
        url: `${API_HOST}/api/people/${PERSON_ID}/`,
        headers: {
            "Authorization": `Token ${getCookie("auth_token")}`
        },
        success: function (json) {
            displayTree(json)
            state.referrals = json
            refreshTable(referralsTable, json)
        },
        error: function (data) {
            console.log(data.responseText)
        }
    })
}

function displayTree(json) {
    var data = []

    for (let child of json) {
        let object = {
            text: child["name"],
            href: "#",
            tags: [child["referrals"].length],
            nodes: []
        }

        for (let grandchild of child.referrals) {
            let grandChildObject = {
                text: grandchild["name"],
                href: "#",
                tags: null
            }

            object.nodes.push(grandChildObject)
        }

        if (child.referrer && child.referrer.id == PERSON_ID) {
            data.push(object)
        }
    }

    $treeView = $("#referral-team-tree-view").treeview({
        data: data,
    })
}