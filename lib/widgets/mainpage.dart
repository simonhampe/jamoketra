import 'package:flutter/material.dart';
import 'package:jamoketra/widgets/trainingpage.dart';

import 'KanaConfigurationGrid.dart';

class MainPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Welcome to Jamoketra")),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Expanded(child: KanaConfigurationGrid(() => {})),
          RaisedButton(
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => TrainingPage()));
              },
              child: Text("Start")),
        ],
      ),
    );
  }
}
