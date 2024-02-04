pragma circom 2.1.6;

template Division() {
  signal input a;
  signal input b;
  signal input c;
  signal output out;
  signal in;

  in <== a * b;
  out <== c * in;
}

component main = Division();
