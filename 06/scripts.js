function assemble() {

    var nospace = [];
    var output = [];

    input = document.getElementById('input').value;

    clean = input.split("\n").filter(line => (line != "") && ((line[0] != "/") && (line[1] != "/")));

    clean.forEach(element => {
        nospace.push(element.replace(/\s+/g, ""));
    });

    nospace.forEach(element => {
        if (element[0] == '@') {
            console.log(element.slice(1, element.length));
        } else if (element[0] == '(') {
            console.log(element.slice(1, element.length - 1));
        } else {
            if(element.includes(';')){
                console.log(element.split(';'));
            } else {
                console.log(element.split('='));
            }
        }
    });

    document.getElementById('output').value = nospace.join('\n');

    console.log(nospace);
}