(function () {
    var obj = icaro({});

    obj.listen(function (changes) {
        console.log("trigger >> array value changed : "+ changes.get('val'));
    });

    function changeValue() {
        var arr = [1, 2, 3, 4, 5];
        var i = 0;
        setInterval(function () {
            obj.val = arr[++i % 5];
        }, 1000);
    }

    changeValue();

})();

