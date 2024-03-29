pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";

template Average(n) {

    signal input in[n];
    signal denominator_inv;
    signal output out;

    var sum;
    for (var i = 0; i < n; i++) {
        sum += in[i];
    }

    denominator_inv <-- 1 / n;

    component eq = IsEqual();
    eq.in[0] <== 1;
    eq.in[1] <== denominator_inv * n;

    out <== sum * denominator_inv;

}

component main  = Average(5);
