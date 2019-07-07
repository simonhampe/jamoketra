import 'package:flutter/material.dart';
import 'package:jamoketra/kana/KanaType.dart';
import 'package:jamoketra/kana/RandomKanaGenerator.dart';
import 'package:jamoketra/validation/input_validation_result.dart';
import 'package:jamoketra/validation/input_validator.dart';
import 'package:jamoketra/widgets/decoration/RandomSmilies.dart';

class TrainingPage extends StatefulWidget {
  @override
  _TrainingPageState createState() => _TrainingPageState();
}

class _TrainingPageState extends State<TrainingPage> {
  final generator = new RandomKanaGenerator(2, 2, KanaType.HIRAGANA);

  bool _isDisabled = true;
  TextEditingController _inputController = new TextEditingController();
  InputValidationResult _validationResult =
      new InputValidationResult(0, ResultState.UNEQUAL_BEFORE_TARGET_END);

  String toType = "";

  @override
  void initState() {
    super.initState();
    resetText();
    _inputController.addListener(onInputChange);
  }

  void resetText() {
    toType = generator.generate();
    _inputController.text = "";
    _isDisabled = true;
  }

  void resetTextStatefully() {
    setState(() {
      resetText();
    });
  }

  void onInputChange() {
    setState(() {
      _validationResult =
          InputValidator.compareStrings(_inputController.text, toType);
      _isDisabled = _validationResult.resultState != ResultState.EQUAL;
    });
  }

  RichText getRichTextFormattedForValidity() {
    return RichText(
      text: TextSpan(children: computeValiditySpans()),
    );
  }

  List<TextSpan> computeValiditySpans() {
    switch (_validationResult.resultState) {
      case ResultState.EQUAL:
        {
          return [
            TextSpan(text: toType, style: TextStyle(color: Colors.green))
          ];
        }
      case ResultState.EQUAL_UP_TO_TARGET_END:
        {
          return [TextSpan(text: toType, style: TextStyle(color: Colors.red))];
        }
      case ResultState.UNEQUAL_BEFORE_TARGET_END:
        {
          return [
            TextSpan(
                text: toType.substring(0, _validationResult.equalCharLength),
                style: TextStyle(color: Colors.green)),
            TextSpan(
                text: toType.substring(_validationResult.equalCharLength),
                style: TextStyle(color: Colors.black))
          ];
        }
      default:
        return [TextSpan(text: toType, style: TextStyle(color: Colors.black))];
    }
  }

  RaisedButton getNextButton() {
    String text = getNextButtonText();
    return RaisedButton(
        onPressed: _isDisabled ? null : resetTextStatefully, child: Text(text));
  }

  String getNextButtonText() {
    String text = "";
    switch (_validationResult.resultState) {
      case ResultState.EQUAL:
        {
          text = RandomSmilies.getRandomHappySmiley();
          break;
        }
      case ResultState.EQUAL_UP_TO_TARGET_END:
        {
          text = RandomSmilies.getRandomAngrySmiley();
          break;
        }
      default:
        {
          text = "Next";
        }
    }
    return text;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: FractionallySizedBox(
        widthFactor: 0.7,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                getRichTextFormattedForValidity(),
                TextField(
                  controller: _inputController,
                ),
                getNextButton(),
                RaisedButton(
                    onPressed: resetTextStatefully, child: Text("Skip")),
                RaisedButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: Text("Cancel"))
              ],
            ),
          ],
        ),
      ),
    ));
  }
}
