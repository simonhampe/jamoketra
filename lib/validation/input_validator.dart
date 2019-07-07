import 'dart:math';

import 'package:jamoketra/validation/input_validation_result.dart';

class InputValidator {
  static InputValidationResult compareStrings(
      String input, String targetString) {
    int equalCharLength = _getEqualCharLength(input, targetString);
    ResultState resultState = _computeResultState(input, targetString);
    return new InputValidationResult(equalCharLength, resultState);
  }

  ///Returns the index up to which the string that is to be typed and the string that is typed are equal. <p>
  ///Returns 0 if the first character does not match.
  static int _getEqualCharLength(String input, String targetString) {
    int equalCharLength = 0;
    for (int index = 0;
        index < min(input.length, targetString.length);
        index++) {
      if (input[index] == targetString[index]) {
        equalCharLength = index + 1;
      } else {
        break;
      }
    }
    return equalCharLength;
  }

  static ResultState _computeResultState(String input, String targetString) {
    if (input == targetString) {
      return ResultState.EQUAL;
    } else {
      return input.startsWith(targetString)
          ? ResultState.EQUAL_UP_TO_TARGET_END
          : ResultState.UNEQUAL_BEFORE_TARGET_END;
    }
  }
}
