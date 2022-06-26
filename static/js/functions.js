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

function createElement(htmlTag, classes = null, attributes = null) {
    node = document.createElement(htmlTag)
    if (classes && typeof classes === 'object')
        for (let cssClass of classes) {
            try {
                node.classList.add(cssClass)
            } catch (error) {

            }
        }

    if (attributes && typeof attributes === 'object') {
        for (let key in attributes) {
            if ( !["text", "textcontent"].includes(key.toLowerCase()) ) {
                node.setAttribute(key, attributes[key])
            } else {
                let textNode = document.createTextNode(attributes[key])
                node.appendChild(textNode)
            }
        }
    }

    return node
}

function createElementFromObject(object) {
    // object must contain a tag attribute (which has a string value)
    // classes attribute (a list consisting of the different css class strings to be applied to the class)
    // and an attributes object (which has the different attributes alongside their values e.g {'id': 'new-div'})
    let element = createElement(object.tag, object.classes, object.attributes)
    return element
}

function createElementFromObject(object) {
    // object must contain a tag attribute (which has a string value)
    // classes attribute (a list consisting of the different css class strings to be applied to the class)
    // and an attributes object (which has the different attributes alongside their values e.g {'id': 'new-div'})
    let element = createElement(object.tag, object.classes, object.attributes)
    return element
}

function createElementsRecursively(object) {
    // object must contain a tag attribute (which has a string value)
    // classes attribute (a list consisting of the different css class strings to be applied to the class)
    // an attributes object (which has the different attributes alongside their values e.g {'id': 'new-div'})
    // and an optional elements attribute, which is a list consisting of other objects which have the same structure as it does
    let element = createElementFromObject(object)

    if (!object.elements) {
        console.log("Creating element with object ")
        console.log(object)
        return element
    } else {
        console.log("Element has children ")
        console.log(object)
        for (let i = 0; i < object.elements.length; i++) {
            childObject = object.elements[i]
            console.log("Creating a child out of object: ")
            console.log(childObject)

            childElement = createElementsRecursively(childObject)

            console.log("The recursion cycle has ended")
            element.appendChild(childElement)
        }

        return element;
    }
}

function generateRandomId(length = 6) {
    while (true) {
        let id = (Math.random() + 1).toString(36).substring(12 - length)

        if (!document.getElementById(id)) {
            return id
        }
    }
}

function gettext(text) {
    return text;
}

function getLocaleTime(dateTimeISO) {
    // returns time in the format Mmm dd, yyyy, h:mm when passed an ISO string
    dt = DateTime.fromISO(dateTimeISO)
    return dt.setLocale(LOCALE).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
}

function showPersonOrders(orderObjects, modalToggleSelector='') {
    // the orderObject passedd must be one that resembles the one generated by the API
    // must have the following attributes; __str__, orderproduct_set, total_paid, amount_to_pay
    // orderproduct_set is a list of objects, each of which must have the following attributes; product_acronym, quantity_ordered, quantity_collected
    // the page must contain a #order-detail modal and a #showOrderDetail item to toggle the modal

    // for (let orderObject of orderObjects) 
    $("#person-orders-accordion").html('')

    orderObjects.map(function (orderObject, index) {
        // create accordion item
        let accordionItem = createElement('div', ['accordion-item'], { id: generateRandomId() })
        $("#person-orders-accordion").append(accordionItem)

        let header = createElement('div', ['accordion-header'], { id: `${accordionItem.id}-header` })
        let button = createElement('button', ['accordion-button'], { type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#${accordionItem.id}-container` })
        button.textContent = orderObject.__str__
        $(accordionItem).append(header)
        $(header).append(button)

        let container = createElement("div", ['accordion-collapse', 'collapse', index==0 ? 'show' : ''], {id: `${accordionItem.id}-container`, "aria-labelledby": header.id, "data-bs-parent": accordionItem.id })
        $(accordionItem).append(container)
        
        let containerBody = createElement("div", ["accordion-body"])
        $(container).append(containerBody)

        // create another accordion for the actual order detail
        let subAccordion = createElement('div', ['accordion'], {id: generateRandomId()})
        $(containerBody).append(subAccordion)

        let subAccordionItemHeaders = [gettext("Ordered products"), gettext("Payments made")]
        let subAccordionColumnHeaders = {
            0: [ gettext("Product"), gettext("Quantity ordered"), gettext("Quantity collected"), gettext("Last refill date"), gettext("Next refill date") ],
            1: [ gettext("Date made"), gettext("Amount"), gettext("Effector") ]
        }
        let tableIdAppendages = {
            0: "order-products",
            1: "order-payments-made"
        }
        let orderProductSelector = ""
        let orderPaymentsSelector = ""

        for (let ctr=0; ctr<2; ctr++) {
            // create a sub accordion item
            let subAccordionItem = createElement('div', ['accordion-item'], {id: generateRandomId()})
            $(subAccordion).append(subAccordionItem)

            let subAccordionHeader = createElement('h3', ['accordion-header', {id: `${subAccordion.id}-header`}])
            let subAccordionButton = createElement('button', ['accordion-button'], {type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#${subAccordionItem.id}-container`})
            subAccordionButton.textContent = subAccordionItemHeaders[ctr]
            $(subAccordionHeader).append(subAccordionButton)

            $(subAccordionItem).append(subAccordionHeader)

            let subAccordionContainer = createElement('div', ['accordion-collapse', 'collapse', "show"], {id: `${subAccordionItem.id}-container`, "aria-labelledby": subAccordionHeader.id})
            $(subAccordionItem).append(subAccordionContainer)

            let subAccordionContainerBody = createElement('div', ['accordion-body'])
            $(subAccordionContainer).append(subAccordionContainerBody)

            $(subAccordionItem).append(subAccordionContainer)

            let subAccordionContainerBodyRow = createElement('div', ['row'])
            $(subAccordionContainerBody).append(subAccordionContainerBodyRow)

            let table = createElement('table', ['table', 'table-striped'])
            $(subAccordionContainerBodyRow).append(table)

            let thead = createElement('thead')
            let tbody = createElement('tbody', [], {id: `${subAccordionContainer.id}-${ tableIdAppendages[ctr] }`})
            $(table).append(thead)
            $(table).append(tbody)

            let theadRow = createElement('tr')
            $(thead).append(theadRow)

            for (let item of subAccordionColumnHeaders[ctr] ) {
                let th = createElement("th")
                th.textContent = item
                $(theadRow).append(th)
            }
            if (ctr == 0)
                orderProductSelector = `#${subAccordionContainer.id}-${tableIdAppendages[0]}`
            if (ctr == 1)
                orderPaymentsSelector = `#${subAccordionContainer.id}-${tableIdAppendages[1]}`
        }

        let paymentsSummaryRow = createElement('div', ['row'], {id: generateRandomId()})
        console.log(paymentsSummaryRow)
        $(containerBody).append(paymentsSummaryRow)
        let paymentsSummaryCaptions = [ gettext("Amount to be paid"), gettext("Total paid"), gettext("Total left") ]
        let paymentsSummaryIdAppendages = ["order_detail_amount_to_be_paid", "order_detail_total", "order_detail_amount_left"]

        for (let i=0; i<paymentsSummaryCaptions.length; i++) {
            caption = paymentsSummaryCaptions[i]
            let paymentSummaryContainer = createElement('div', ['col-md-4'])
            $(paymentsSummaryRow).append(paymentSummaryContainer)

            let label = createElement("label")
            label.textContent = caption
            let input = createElement('input', ['form-control'], {type: "number", id: `${paymentsSummaryRow.id}_${paymentsSummaryIdAppendages[i]}`, "readonly": true})

            $(paymentSummaryContainer).append(label)
            $(paymentSummaryContainer).append(input)
        }

        $(`${orderProductSelector}`).html('')
        $(`${orderPaymentsSelector}`).html('')

        for (let product of orderObject.orderproduct_set) {
            let row = createElement('tr')

            let cell = createElement('td')
            cell.textContent = product["product_acronym"]
            row.appendChild(cell)

            attributes = ["quantity_ordered", "quantity_collected", "last_refill_date", "next_refill_date"]

            for (let attribute of attributes) {
                cell = createElement('td')

                input = createElement('input', ['form-control'], { 'readonly': true, type: "text" })

                if (attributes.slice(2).includes(attribute)) {
                    product[attribute] === null ? input.value = gettext("---") : input.value = getLocaleTime(product[attribute])
                } else {
                    input.value = product[attribute]
                }

                cell.appendChild(input)
                row.appendChild(cell)
            }
            $(`${orderProductSelector}`).append(row)

            $(`#${paymentsSummaryRow.id}_${paymentsSummaryIdAppendages[1]}`).val(orderObject.total_paid)
            $(`#${paymentsSummaryRow.id}_${paymentsSummaryIdAppendages[0]}`).val(orderObject.amount_to_pay)
            $(`#${paymentsSummaryRow.id}_${paymentsSummaryIdAppendages[2]}`).val(orderObject.total_left)
        }

        if ('orderpayment_set' in orderObject) {
            for (let payment of orderObject.orderpayment_set) {
                let row = createElement('tr')
                let fields = ["time_made", "amount", "effector"]

                for (let field of fields) {
                    let cell = createElement('td')

                    field == fields[0] ? cell.textContent = getLocaleTime(payment[field]) : cell.textContent = payment[field]
                    row.appendChild(cell)
                }
                $(`${orderPaymentsSelector}`).append(row)
            }
        }

        $(modalToggleSelector).click()
    })
}

BOOTSTRAP_TARGET_ATTRIBUTE