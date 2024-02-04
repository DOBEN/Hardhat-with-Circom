pragma circom 2.0.3;

template Mul() {

    signal input in[2]; // takes two inputs
    signal output out; // single output
    
    out <== in[0] * in[1];
}

component main = Mul();
