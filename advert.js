//facebook pixel
//!function(f,b,e,v,n,t,s)
//{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//    n.queue=[];t=b.createElement(e);t.async=!0;
//    t.src=v;s=b.getElementsByTagName(e)[0];
//    s.parentNode.insertBefore(t,s)}(window,document,'script',
//   'https://connect.facebook.net/en_US/fbevents.js');
//fbq('init', '1167297069973116');
//fbq('track', 'PageView');

//vkontakte pixel
(window.Image ? (new Image()) : document.createElement('img')).src = 'badbrowser.php'/*tpa=https://vk.com/rtrg?p=VK-RTRG-28591-5rLRv*/;

////admitad
//var Admitad = {
//    lead: function (orderId) {
//        var uid = /admitad_uid=([^;]+)/.exec(document.cookie);
//        if (!uid) {
//            return;
//        }

//        uid = uid[1];

//        (function (d, w) {
//            w._admitadPixel = {
//                response_type: 'img',     // 'script' or 'img'. Default: 'img'
//                action_code: '2',
//                campaign_code: '1576ba8a35'
//            };
//            w._admitadPositions = w._admitadPositions || [];
//            w._admitadPositions.push({
//                uid: uid,
//                tariff_code: '1',
//                order_id: orderId,
//                position_id: 1,
//                currency_code: 'RUR',
//                position_count: '1',
//                payment_type: 'lead'
//            });
//            var id = '_admitad-pixel';
//            if (d.getElementById(id)) { return; }
//            var s = d.createElement('script');
//            s.id = id;
//            var r = (new Date).getTime();
//            var protocol = (d.location.protocol === 'https:' ? 'https:' : 'http:');
//            s.src = protocol + '//cdn.asbmit.com/static/js/pixel.min.js?r=' + r;
//            var head = d.getElementsByTagName('head')[0];
//            head.appendChild(s);
//        })(document, window);
//    }
//};

(function (aid) {
    if (aid = aid.exec(location.search)) {
        document.cookie = '_'+ aid[0] + '; path=/; expires=' + new Date(86400000 * 45 + +new Date);
    }
})(/admitad_uid=[^&]+/);