import 'package:flutter/material.dart';
import 'package:jamoketra/kana/KanaGeneratorConfiguration.dart';

class KanaConfigurationGrid extends StatefulWidget {

  final Function _updateCallback;

  KanaConfigurationGrid(this._updateCallback);

  @override
  State<StatefulWidget> createState() {
    return _KanaConfigurationGridState();
  }
}

class _KanaConfig {
  bool hiragana = false;
  bool katakana = false;
}

class _KanaConfigurationGridState extends State<KanaConfigurationGrid> {

  _KanaConfig _AGroupConfig = new _KanaConfig();
  _KanaConfig _KGroupConfig = new _KanaConfig();
  _KanaConfig _SGroupConfig = new _KanaConfig();
  _KanaConfig _TGroupConfig = new _KanaConfig();
  _KanaConfig _NGroupConfig = new _KanaConfig();
  _KanaConfig _HGroupConfig = new _KanaConfig();
  _KanaConfig _MGroupConfig = new _KanaConfig();
  _KanaConfig _YGroupConfig = new _KanaConfig();
  _KanaConfig _RGroupConfig = new _KanaConfig();
  _KanaConfig _WGroupConfig = new _KanaConfig();
  _KanaConfig _TenTenMaruConfig = new _KanaConfig();

  bool _isEditingHiragana = true;


  Text getText(String hiragana, String katakana) {
    return Text(_isEditingHiragana ? hiragana : katakana);
  }

  Color getColor(_KanaConfig config) {
    return getColorByState(_isEditingHiragana? config.hiragana : config.katakana);
  }

  Color getColorByState(bool state) {
    return state? Colors.green : Colors.grey;
  }

  void toggleConfig(_KanaConfig config) {
    setState(() {
      if(_isEditingHiragana) {
        config.hiragana = !config.hiragana;
      } else {
        config.katakana = !config.katakana;
      }
    });
    widget._updateCallback(buildConfiguration());
  }

  KanaGroupConfiguration buildConfiguration() {
    return new KanaGroupConfiguration();
  }


  FlatButton _buildButton(String hiragana, String katakana, _KanaConfig config) {
    return FlatButton(
      child: getText(hiragana, katakana),
      color: getColor(config),
      onPressed: () => toggleConfig(config),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GridView.count(crossAxisCount: 3, children: <Widget>[
      _buildButton("あ", "ア", _AGroupConfig),
      _buildButton("か", "カ", _KGroupConfig),
      _buildButton("さ", "サ", _SGroupConfig),
      _buildButton("た", "タ", _TGroupConfig),
      _buildButton("な", "ナ", _NGroupConfig),
      _buildButton("は", "ハ", _HGroupConfig),
      _buildButton("ま", "マ", _MGroupConfig),
      _buildButton("や", "ヤ", _YGroupConfig),
      _buildButton("ら", "ラ", _RGroupConfig),
      _buildButton("ﾟ/ ﾞ", "ﾟ/ ﾞ", _TenTenMaruConfig),
      _buildButton("わ", "ワ", _WGroupConfig),
      FlatButton(
        child: Text("Switch to\n" + (_isEditingHiragana ? "Hiragana":"Katakana") + "\nselection"),
        onPressed: () => setState(() => _isEditingHiragana = !_isEditingHiragana),
      )
    ]);
  }
}
