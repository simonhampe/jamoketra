import 'dart:math';

import 'package:jamoketra/kana/KanaType.dart';

class RandomKanaGenerator {

  final int minLength;
  final int maxLength;
  final KanaType type;

  Random random;

  RandomKanaGenerator(this.minLength, this.maxLength, this.type) {
    this.random = new Random();
  }

  String generate() {
    final buffer = new StringBuffer();
    final length = minLength + random.nextInt(maxLength - minLength + 1);
    for(int i = 0; i < length; i++) {
      buffer.write(type.characters[random.nextInt(type.characters.length)]);
    }
    return buffer.toString();
  }

}