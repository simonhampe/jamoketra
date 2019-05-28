import 'package:flutter/material.dart';
import 'package:jamoketra/kana/KanaType.dart';
import 'package:jamoketra/kana/RandomKanaGenerator.dart';
import 'package:jamoketra/widgets/mainpage.dart';

class TrainingPage extends StatefulWidget {
  @override
  _TrainingPageState createState() => _TrainingPageState();
}

class _TrainingPageState extends State<TrainingPage> {
  final _formKey = GlobalKey<FormState>();
  final generator = new RandomKanaGenerator(5, 10, KanaType.HIRAGANA);
  bool _isDisabled = true;
  TextEditingController _inputController = new TextEditingController();

  String toType = "";

  @override
  void initState() {
    setText();
    _inputController.addListener(onInputChange);
  }

  void setText() {
    toType = generator.generate();
    _inputController.text = "";
    _isDisabled = true;
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
            Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text(toType),
                  TextFormField(controller: _inputController),
                  RaisedButton(
                      onPressed: _isDisabled
                          ? null
                          : () {
                              setState(() {
                                setText();
                              });
                            },
                      child: Text("Next")),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      RaisedButton(
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => MainPage()));
                          },
                          child: Text("Cancel"))
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    ));
  }
}
