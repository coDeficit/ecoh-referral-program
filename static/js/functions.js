function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function refreshTable(tableObject, newData) {
    tableObject.clear()
    tableObject.rows.add(newData)
    tableObject.draw()
}

const API_HOST = getCookie("api_host")
const PERSON = JSON.parse( getCookie("person").replace(/\+/g, '') )

try {
    const USER = JSON.parse( getCookie("user").replace(/\+/g, '') )   
} catch (error) {
    console.log("Error parsing user cookie")
    const USER = null;
}

const PERSON_ID = getCookie("person_id")

function assignPersonToPerson(personToAssign, person) {
    if (API_HOST && PERSON_ID) {
        $.ajax({
            type: "POST",
            url: `${API_HOST}/api/people/`
        })
    }
}