function assemble() {

    var nospace = [];
    var output = [];
    var a0dict = {
        '0': '101010', '1': '111111', '-1': '111010', 'D': '001100', 'A': '110000', '!D': '001101', '!A': '110001', '-D': '001111', '-A': '110011',
        'D+1': '011111', 'A+1': '110111', 'D-1': '001110', 'A-1': '110010', 'D+A': '000010', 'D-A': '010011', 'A-D': '000111', 'D&A': '000000', 'D|A': '010101'
    };
    var a1dict = {
        'M': '110000', '!M': '110001', '-M': '110011', 'M+1': '110111', 'M-1': '110010', 'D+M': '000010', 'D-M': '010011', 'M-D': '000111', 'D&M': '000000', 'D|M': '010101'
    };
    var jdict = {
        '': '000', 'JGT': '001', 'JEQ': '010', 'JGE': '011', 'JLT': '100', 'JNE': '101', 'JLE': '110', 'JMP': '111'
    }
    var variables = new Map();
    variables.set('SP',0);
    variables.set('LCL',1);
    variables.set('ARG',2);
    variables.set('THIS',3);
    variables.set('THAT',4);
    variables.set('SCREEN',16384);
    variables.set('KBD',24576);
    var regC = new RegExp('^(([ADM]+=(([-!]?[01ADM])|([ADM][-+|&][ADM1])))|([0ADM];J(GT|EQ|GE|LT|NE|LE|MP)))$');
    var regA = new RegExp('^\\d+$', 'm');
    var regR = new RegExp('^R\\d+$')
    var mempointer = 16;

    input = document.getElementById('input').value;

    clean = input.split("\n").filter(line => (line != "") && ((line[0] != "/") && (line[1] != "/")));

    clean.forEach(element => {
        temp = element.replace(/\s+/g, "").split("//");
        temp = temp[0];
        nospace.push(temp);
    });

    var ROM = 0;

    nospace.forEach(element => {
        
        if (element[0] == '('){
            console.log(element.slice(1, element.length - 1), ROM);
            variables.set(element.slice(1, element.length - 1),ROM);
        } else {
            ROM++;
        }
    });

    // var x= variables.entries;
    // console.log(x);

    nospace.forEach(element => {
        binary = Array(13).fill(1);
        binary = binary.concat([0, 0, 0]);
        if (element[0] == '@') {
            rightside = element.slice(1, element.length);
            if (regA.test(rightside)) {
                binarytarget = parseInt(rightside).toString(2);
                binary = Array(16 - binarytarget.length).fill(0).concat(binarytarget);
            } else {
                if (regR.test(rightside)) {
                    binarytarget = parseInt(rightside.slice(1, rightside.length)).toString(2);
                    binary = Array(16 - binarytarget.length).fill(0).concat(binarytarget);
                } else {
                    //xconsole.log(variables);
                    if (!isNaN(variables.get(rightside))) {
                        //console.log(rightside, variables.get(rightside));
                        var mem = variables.get(rightside);
                        binarytarget = mem.toString(2);
                        binary = Array(16 - binarytarget.length).fill(0).concat(binarytarget);
                    } else {
                        variables.set(rightside, mempointer);
                        binarytarget = mempointer.toString(2);
                        binary = Array(16 - binarytarget.length).fill(0).concat(binarytarget);
                        mempointer++;
                    }
                }
            }
        } else if (element[0] == '(') {
            //console.log(element.slice(1, element.length - 1));
        } else {
            if (regC.test(element)) {
                if (element.includes(';')) {
                    leftside = element.split(';')[0];
                    rightside = element.split(';')[1];
                    if (leftside.includes('M')) {
                        cval = a1dict[leftside];
                    } else {
                        binary[3] = 0;
                        cval = a0dict[leftside];
                    }
                    for (i = 0; i < 6; i++)
                        binary[i + 4] = cval[i];
                    jval = jdict[rightside];
                    for (i = 0; i < 3; i++) {
                        binary[i + 10] = 0;
                        binary[i + 13] = jval[i];
                    }
                } else if (element.includes('=')) {
                    leftside = element.split('=')[0];
                    rightside = element.split('=')[1];
                    if (rightside.includes('M')) {
                        cval = a1dict[rightside];
                    } else {
                        binary[3] = 0;
                        cval = a0dict[rightside];
                    }
                    for (i = 0; i < 6; i++)
                        binary[i + 4] = cval[i];
                    if (!leftside.includes('A')) {
                        binary[10] = '0';
                    }
                    if (!leftside.includes('D')) {
                        binary[11] = '0';
                    }
                    if (!leftside.includes('M')) {
                        binary[12] = '0';
                    }
                } else {
                    binary = ['Inva', 'lid!'];
                }
            } else {
                binary = ['Inva', 'lid!'];
            }
        }
        output.push(binary.join(''));
    });

    if (output.includes('Invalid!')) {
        document.getElementById('output').value = 'Invalid line ' + output.indexOf('Invalid!') + ':\n' + nospace[output.indexOf('Invalid!')];
    } else {
        document.getElementById('output').value = output.join('\n');
    }

}