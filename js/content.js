chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "open_dialog_box") {
            tech_all();
        }
    });

function tech_all() {
    var script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
    document.head.appendChild(script);
    var ip = document.createElement('div');
    ip.setAttribute('style', 'position:fixed;top:0;padding:10px;background:#000;color:#fff;font-size:14px;z-index:999; text-align:center;');
    ip.innerHTML = '<div id=\'tech_cp\' style=\'float:left\'><div>V19.1 Auto Load <input type=\'number\' value=\'4\' id=\'tech_number\' style=\'width:25px;\'> Page(s) and:</div><div id=\'sort\'><button id=\'tech_sortr\' style=\'padding:5px;margin:10px 0;\'>Sort by Saves</button></div> <a href="http://www.roi.im/" target="_blank"><img src="http://www.pinontop.com/banner.jpg"></a>';
    document.body.appendChild(ip);
    var tech_sortr = document.getElementById('tech_sortr');
    tech_sortr.addEventListener('click', function () {
        tech_load()
    }, !1)
};

var count = 0;
var mylist = [];
var timeout;
var insertedNodes = [];
var loadedIDs = [];

async function tech_load() {
    jQuery('#sort').html('Loading, Please Wait...');


    const awaits = Array.from(document.querySelectorAll('[data-test-pin-id]')).map(async (x) => {
        try {
            var $thepin = jQuery(x);
            var pinID = jQuery(x).attr('data-test-pin-id');
            if (loadedIDs.includes(pinID)) {
                console.log('Already included ID:', loadedIDs);
                return;
            }

            loadedIDs.push(pinID);

            const protocol = location.protocol;
            const domain = location.hostname;
            const url = `${protocol}//${domain}/resource/PinResource/get/?source_url=/pin/${pinID}/&data={"options":{"id":"${pinID}","field_set_key":"detailed","is_landing_page":false},"context":{}}&_=1523412899257`;

            console.log(url);

            const data = await Promise.resolve(jQuery.get(url));
            let saves;
            try {
                saves = data.resource_response.data.aggregated_pin_data.aggregated_stats.saves || -1;
            }
            catch (ex) {
                saves = -1;
            }
            var pinbox = '<a href=\'/pin/' + pinID + '/\' style=\'position:absolute;top:0;color:black;background:#fff;z-index:9999;font-size:200%;\' target=\'_blank\'>Saves: ' + saves + '</a>';
            $thepin.attr('rel', saves).addClass('pinbox').append(pinbox);

            const parentElement = $thepin.closest('[data-grid-item="true"]').clone()[0];
            if (parentElement) insertedNodes.push(parentElement);
            else console.error($thepin, parentElement);
        }
        catch (ex) {
            console.log('Cant fetch data', ex);
        }
    });

    await Promise.all(awaits);

    console.log('insertedNodes', jQuery('[data-test-pin-id]'), insertedNodes);
    count++;
    window.setTimeout(function () {
        if (count == parseInt(jQuery('#tech_number').val())) {
            finish()
        } else {
            jQuery(window).scrollTop(jQuery(document).height());
            timeout = window.setTimeout(tech_load, 4000)
        }
    }, 2000)
};

function finish() {
    window.clearTimeout(timeout);
    jQuery('div[data-grid-item=\'true\']').parent().before('<div id=\'newgrid\'></div>');
    jQuery('div[data-grid-item=\'true\']').parent().remove();
    var node = document.createElement('div');
    insertedNodes.forEach(function (e) {
        node.appendChild(e)
    });
    document.getElementById('newgrid').appendChild(node);
    list = jQuery('#newgrid .pinbox').toArray();
    list.sort(function (a, b) {
        var compA = parseInt(jQuery(a).attr('rel')) || 0;
        var compB = parseInt(jQuery(b).attr('rel')) || 0;
        return (compA == compB) ? 0 : (compA > compB) ? -1 : 1
    });
    jQuery('#newgrid').empty();
    var listall = '<div class="pinterest--container">';
    list.forEach(function (e, i) {
        jQuery(e)
            //.attr('style', 'width:20%;float:left;position:relative;margin:0 20px 60px 0')
            .addClass('pinterest--block');
        listall += e.outerHTML
    });
    var fff = '<style>div{padding-bottom:0 !important}</style>' + listall + "</div>";
    document.write(fff);
    window.scrollTo(0, 0)

    /* $(document).ready(function() {
        $('.pinterest--container').masonry({
            itemSelector: '.pinterest--block',
            columnWidth: 0,
            horizontalOrder: true
        });
    }); */

}