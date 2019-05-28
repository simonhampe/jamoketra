import 'package:flutter/material.dart';
import 'package:jamoketra/kana/KanaType.dart';
import 'package:jamoketra/kana/RandomKanaGenerator.dart';

class TrainingPage extends StatefulWidget {
  @override
  _TrainingPageState createState() => _TrainingPageState();
}

class _TrainingPageState extends State<TrainingPage> {
  final generator = new RandomKanaGenerator(1, 1, KanaType.HIRAGANA);
  bool _isDisabled = true;
  TextEditingController _inputController = new TextEditingController();

  String toType = "";

  @override
  void initState() {
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
      _isDisabled = _inputController.text != toType;
    });
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
                Text(toType),
                TextFormField(controller: _inputController),
                RaisedButton(
                    onPressed: _isDisabled ? null : resetTextStatefully,
                    child: Text("Next")),
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
