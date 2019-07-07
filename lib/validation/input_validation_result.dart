enum ResultState { EQUAL, UNEQUAL_BEFORE_TARGET_END, EQUAL_UP_TO_TARGET_END }

class InputValidationResult {
  final int equalCharLength;
  final ResultState resultState;

  InputValidationResult(this.equalCharLength, this.resultState);
}
