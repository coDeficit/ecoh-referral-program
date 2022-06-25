var $treeView;

function tableViewButton(data) {
    if (data.length > 0)
        `<button class="btn btn-outline-primary">View (${data.length})</button>`
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
                        return `<button class="btn btn-outline-primary" data-target="#person-orders" data-toggle="modal" onclick=viewPersonOrders(${row["id"]})>View (${data.length})</button>`
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
                if (type == 'display')
                    return tableViewButton(data)
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
    $("#person-orders-panel-content").html("")

    if (person !== null) {
        let orders = person.orders
        $("#person-orders .modal-title").text(gettext(`${person.name}'s orders`))

        for (let order of orders) {
            let panelItemId = generateRandomId()
            let rows = []

            for (let product of order["orderproduct_set"]) {
                // columns: product acronym, quantity ordered, quantity collected, quantity_left, last refill date, next refill date
                let rowObject = {
                    tag: 'tr',
                    elements: [
                        {
                            tag: 'td',
                            attributes: {
                                text: product["product_acronym"]
                            }
                        },
                        {
                            tag: 'td',
                            attributes: {
                                text: product["quantity_ordered"]
                            }
                        },
                        {
                            tag: 'td',
                            attributes: {
                                text: product["quantity_collected"]
                            }
                        },
                        {
                            tag: 'td',
                            attributes: {
                                text: product["quantity_ordered"] - product["quantity_collected"]
                            }
                        },
                        {
                            tag: 'td',
                            attributes: {
                                text: product["last_refill_date"] ? '' : product["last_refill_date"]
                            }
                        },
                        {
                            tag: 'td',
                            attributes: {
                                text: product["next_refill_date"] ? '' : product["next_refill_date"]
                            }
                        }
                    ]
                }

                rows.push(rowObject)
            }

            // create an panel item
            let elementObject = {
                tag: "div",
                classes: ["panel", "panel-default"],
                attributes: { id: panelItemId },
                elements: [
                    {
                        tag: "div",
                        classes: ["panel-heading"],
                        attributes: { role: "tab", "id": `${panelItemId}-heading` },
                        elements: [
                            {
                                tag: "h4",
                                classes: ["pt-2", "pb-lg-1", "pb-xl-0", "panel-title"],
                                attributes: {},
                                elements: [
                                    {
                                        tag: "a",
                                        classes: ["pt-md-3", "pt-lg-4", "pb-md-3", "pb-lg-3", "pb-xl-4"],
                                        attributes: {
                                            role: "button",
                                            "data-toggle": "collapse",
                                            "data-parent": "#person-orders-panel",
                                            href: `#${panelItemId}-panel-collapse`,
                                            "aria-expanded": true,
                                            "aria-controls": `${panelItemId}-panel-collapse`,
                                            text: order["__str__"]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: "div",
                        classes: ["panel-collapse", "collapse", "show"],
                        attributes: {
                            "id": `#${panelItemId}-panel-collapse`, "aria-labelledby": `${panelItemId}-button`
                        },
                        elements: [
                            {
                                tag: "div",
                                classes: ["panel-body"],
                                attributes: {},
                                elements: [
                                    {
                                        tag: "div",
                                        classes: ["row"],
                                        attributes: {},
                                        elements: [
                                            {
                                                tag: "table",
                                                classes: ["table", "table-striped"],
                                                attributes: {},
                                                elements: [
                                                    {
                                                        tag: "thead",
                                                        classes: [],
                                                        attributes: {},
                                                        elements: [
                                                            {
                                                                tag: "tr",
                                                                elements: [
                                                                    {
                                                                        tag: "td",
                                                                        attributes: { text: gettext("Product") }
                                                                    },
                                                                    {
                                                                        tag: "td",
                                                                        attributes: { text: gettext("Quantity ordered") }
                                                                    },
                                                                    {
                                                                        tag: "td",
                                                                        attributes: { text: gettext("Quantity collected") }
                                                                    },
                                                                    {
                                                                        tag: "td",
                                                                        attributes: { text: gettext("Quantity left") }
                                                                    },
                                                                    {
                                                                        tag: "td",
                                                                        attributes: { text: gettext("Last refill date") }
                                                                    },
                                                                    {
                                                                        tag: "td",
                                                                        attributes: { text: gettext("Next refill date") }
                                                                    },
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        tag: "tbody",
                                                        elements: rows
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

            let element = createElementsRecursively(elementObject)

            $("#person-orders-panel-content").append(element)
        }
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