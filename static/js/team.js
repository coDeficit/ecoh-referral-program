json = [
    {
        "id": 287,
        "name": "Messi Salvatore",
        "first_name": "Messi",
        "last_name": "Salvatore",
        "middle_names": null,
        "gender": "M",
        "city_of_residence": "Yaounde",
        "country_of_residence": "Cameroon",
        "date_of_birth": null,
        "phone": null,
        "referrer": {
            "id": 80,
            "name": "Doctor Alice",
            "first_name": "Doctor",
            "middle_names": "",
            "last_name": "Alice",
            "gender": "F",
            "city_of_residence": "Yaounde",
            "country_of_residence": "Cameroon",
            "phone": "696643348"
        },
        "assigned_referrer": {
            "id": 80,
            "name": "Doctor Alice",
            "first_name": "Doctor",
            "middle_names": "",
            "last_name": "Alice",
            "gender": "F",
            "city_of_residence": "Yaounde",
            "country_of_residence": "Cameroon",
            "phone": "696643348"
        },
        "referrals": [
            {
                "id": 289,
                "name": "Owono Nchama jaime Obam",
                "first_name": "Owono",
                "middle_names": "Nchama jaime",
                "last_name": "Obam",
                "gender": "M",
                "city_of_residence": "Yaounde",
                "country_of_residence": "Cameroon",
                "phone": null
            }
        ],
        "__str__": "Messi Salvatore"
    },
    {
        "id": 289,
        "name": "Owono Nchama jaime Obam",
        "first_name": "Owono",
        "last_name": "Obam",
        "middle_names": "Nchama jaime",
        "gender": "M",
        "city_of_residence": "Yaounde",
        "country_of_residence": "Cameroon",
        "date_of_birth": null,
        "phone": null,
        "referrer": {
            "id": 287,
            "name": "Messi Salvatore",
            "first_name": "Messi",
            "middle_names": null,
            "last_name": "Salvatore",
            "gender": "M",
            "city_of_residence": "Yaounde",
            "country_of_residence": "Cameroon",
            "phone": null
        },
        "assigned_referrer": {
            "id": 287,
            "name": "Messi Salvatore",
            "first_name": "Messi",
            "middle_names": null,
            "last_name": "Salvatore",
            "gender": "M",
            "city_of_residence": "Yaounde",
            "country_of_residence": "Cameroon",
            "phone": null
        },
        "referrals": [],
        "__str__": "Owono Obam"
    }
]

var $treeView;

var data = []

const PERSON_ID = 80

for (let child of json) {
    let object = {
        text: child["name"],
        href: "#",
        tags: [ child["referrals"].length ],
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

    if (child.referrer.id == PERSON_ID) {
        data.push(object)
    }
}

$treeView = $("#referral-team-tree-view").treeview({
    data: data,
})