const DateTime = luxon.DateTime

console.log("In wallet.js")

var rewardsTable = $("#table").DataTable({
    "columns": [
        {   
            "data": "time_made",
            render: function(data, type, row, meta) {
                timeMade = DateTime.fromISO(data)
                console.log("Logging data n timeMade; wallet.js 11")
                console.log(data, timeMade)
                return timeMade.toLocaleString(DateTime.DATETIME_MED)
            }
        },
        {
            "data": "amount"
        },
        {
            "render": function(data, type, row, meta) {
                return row["referrer_detail"]["name"]
            }
        }
    ]
})

if (API_HOST && PERSON_ID) {
    console.log("Making GET request to api")
    $.ajax({
        type: "GET",
        url: `${API_HOST}/api/people/${PERSON_ID}/referral-rewards`,
        headers: {
            "Authorization": `Token ${getCookie("auth_token")}`
        },
        success: function(data) {
            console.log("Data gotten from the API successfully")
            console.log(data)
            rewardsTable.clear()
            rewardsTable.rows.add(data)
            rewardsTable.draw()
        },
        error: function (data) {
            console.log(data)
        }
    })
}