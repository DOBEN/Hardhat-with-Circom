pragma circom 2.1.6;

template Square() {

    signal input in;
    signal output out;

    out <== in * in;
}

template SumOfSquares() {
    signal input a;
    signal input b;
    signal output out;

    component sq1 = Square();
    component sq2 = Square();

    // wiring the components together
    sq1.in <== a;
    sq2.in <== b;

    out <== sq1.out + sq2.out;
}

component main = SumOfSquares();
