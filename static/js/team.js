var $treeView;

function tableViewButton(data) {
    if (data.length > 0)
        return `<button class="btn btn-outline-primary">View (${data.length})</button>`
    else
        return "---"
}

let state = {
    referrals: []
}

PERSON_HOME_URL = '/home'

var referralsTable = $("#table").DataTable({
    "columns": [
        {
            "data": "name",
            render: function (data, type, row, meta) {
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
            "render": function (data, type, row, meta) {
                if (type == 'display')
                    return `<a href='/${row.referrer.slug}'>${row.referrer.name}</a>`
                return row["referrer"]["name"]
            }
        },
        {
            "data": "orders",
            render: function (data, type, row, meta) {
                if (type == 'display')
                    if (data.length > 0) {
                        return `<button class="btn btn-outline-primary" data-bs-target="#person-orders" data-bs-dismiss="modal" data-bs-toggle="modal" onclick=viewPersonOrders(${row["id"]})>View (${data.length})</button>`
                    } else {
                        return "---"
                    }
                else
                    return data.length
            }
        },
        {
            "data": "referrals",
            render: function (data, type, row, meta) {
                if (type == 'display') {
                    if (data.length > 0) {
                        return `<button class="btn btn-outline-primary" data-bs-target="#person-referrals" data-bs-dismiss="modal" data-bs-toggle="modal" onclick=viewPersonReferrals(${row["id"]})>View (${data.length})</button>`
                    } else {
                        return "---"
                    }
                }
                else
                    return data.length
            }
        },
        {
            "render": function (data, type, row, meta) {
                return "---"
            }
        },
        {
            "render": function (data, type, row, meta) {
                if (type == 'display' && !row.assigned_referrer) {
                    if (row.referrer.id == PERSON["id"])
                        return `<button class='btn btn-outline-secondary'>Assign</button>`
                    else
                        return 'Unassigned'
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

var personReferralsTable = $("#person-referrals-table").DataTable({
    "columns": [
        {
            "data": "name",
            render: function (data, type, row, meta) {
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
            "render": function (data, type, row, meta) {
                return "---"
            }
        }
    ]
})

function getPersonInState(personId) {
    let person = null;

    for (let item of state.referrals) {
        if (item['id'] == personId) {
            return item;
        }
    }

    return person;
}

function viewPersonOrders(personId) {
    let person = getPersonInState(personId)

    if (person !== null) {
        let orders = person.orders
        
        showPersonOrders(orders)
    } else {
        alert(gettext(`No person exists with id: ${personId}`))
    }
}

function viewPersonReferrals(personId) {
    let person = getPersonInState(personId)
    personReferralsTable.clear()

    if (person !== null) {
        refreshTable(personReferralsTable, person.referrals)
    } else {
        alert(gettext(`No person exists with id: ${personId}`))
    }
}

if (API_HOST && PERSON_ID) {
    $.ajax({
        type: "GET",
        url: `${API_HOST}/api/people/${PERSON_ID}/referrals`,
        headers: {
            "Authorization": `Token ${getCookie("auth_token")}`
        },
        success: function (json) {
            let object = json

            // uncomment this when we figure out a way to display datatables from
            // object of objects instead of array of objects
            // for (let item of json) {
            //     object[item["id"]] = item
            // }

            state.referrals = object

            refreshTable(referralsTable, state.referrals)
            displayTree(json)
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