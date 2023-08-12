window.customCards = window.customCards || [];
window.customCards.push({
  type: "fan-percent-button-7row",
  name: "fan percent button 7row",
  description: "A plugin to display your fan controls in a button row.",
  preview: false,
});

const LitElement = customElements.get("ha-panel-lovelace") ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace")) : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class CustomFanPercent7Row extends LitElement {

	constructor() {
		super();
		this._config = {
			customTheme: false,
			customSetpoints: false,
			reverseButtons: false,
			hideOffButton: false,
			hideButton1: false,
			hideButton2: false,
			hideButton3: false,
			hideButton4: false,
			hideButton5: false,
			hideButton6: false,
			sendStateWithSpeed: false,
			allowDisablingButtons: true,
			buttonOffPercentage: 0,
			button1Percentage: 16,
			button2Percentage: 33,
			button3Percentage: 50,
			button4Percentage: 66,
			button5Percentage: 83,
			button6Percentage: 100,
			width: '30px',
			height: '30px',
			isOffColor: '#f44c09',
			speed1Color: '#43A047',
			speed2Color: '#43A047',
			speed3Color: '#43A047',
			speed4Color: '#43A047',
			speed5Color: '#43A047',
			speed6Color: '#43A047',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			speed1Text: '1',
			speed2Text: '2',
			speed3Text: '3',
			speed4Text: '4',
			speed5Text: '5',
			speed6Text: '6',
		};
	}

	static get properties() {
		return {
			hass: Object,
			_config: Object,
			_stateObj: Object,
			_buttonOffSP: Number,
			_button1SP: Number,
			_button2SP: Number,
			_button3SP: Number,
			_button4SP: Number,
			_button5SP: Number,
			_button6SP: Number,
			_width: String,
			_height: String,
			_button1Color: String,
			_button2Color: String,
			_button3Color: String,
			_button4Color: String,
			_button5Color: String,
			_button6Color: String,
			_button7Color: String,
			_button1Text: String,
			_button2Text: String,
			_button3Text: String,
			_button4Text: String,
			_button5Text: String,
			_button6Text: String,
			_button7Text: String,
			_button1Name: String,
			_button2Name: String,
			_button3Name: String,
			_button4Name: String,
			_button5Name: String,
			_button6Name: String,
			_button7Name: String,
			_button1: String,
			_button2: String,
			_button3: String,
			_button4: String,
			_button5: String,
			_button6: String,
			_button7: String,
			_button1State: Boolean,
			_button2State: Boolean,
			_button3State: Boolean,
			_button4State: Boolean,
			_button5State: Boolean,
			_button6State: Boolean,
			_button7State: Boolean,
		};
	}

	static get styles() {
		return css`
			:host {
				line-height: inherit;
			}
			.box {
				display: flex;
				flex-direction: row;
			}
			.percentage {
				margin-left: 2px;
				margin-right: 2px;
				background-color: #759aaa;
				border: 1px solid lightgrey; 
				border-radius: 4px;
				font-size: 10px !important;
				color: inherit;
				text-align: center;
				float: left !important;
				padding: 1px;
				cursor: pointer;
			}
		`;
	}

	render() {
		return html`
			<hui-generic-entity-row .hass="${this.hass}" .config="${this._config}">
				<div id='button-container' class='box'>
					<button
						class='percentage'
						style='${this._button1Color};min-width:${this._width};max-width:${this._width};height:${this._height};${this._button1}'
						toggles name="${this._button1Name}"
						@click=${this.setPercentage}
						.disabled=${this._button1State}>${this._button1Text}</button>
					<button
						class='percentage'
						style='${this._button2Color};min-width:${this._width};max-width:${this._width};height:${this._height};${this._button2}'
						toggles name="${this._button2Name}"
						@click=${this.setPercentage}
						.disabled=${this._button2State}>${this._button2Text}</button>
					<button
						class='percentage'
						style='${this._button3Color};min-width:${this._width};max-width:${this._width};height:${this._height};${this._button3}'
						toggles name="${this._button3Name}"
						@click=${this.setPercentage}
						.disabled=${this._button3State}>${this._button3Text}</button>
					<button
						class='percentage'
						style='${this._button4Color};min-width:${this._width};max-width:${this._width};height:${this._height};${this._button4}'
						toggles name="${this._button4Name}"
						@click=${this.setPercentage}
						.disabled=${this._button4State}>${this._button4Text}</button>
					<button
						class='percentage'
						style='${this._button5Color};min-width:${this._width};max-width:${this._width};height:${this._height};${this._button5}'
						toggles name="${this._button5Name}"
						@click=${this.setPercentage}
						.disabled=${this._button5State}>${this._button5Text}</button>
					<button
						class='percentage'
						style='${this._button6Color};min-width:${this._width};max-width:${this._width};height:${this._height};${this._button6}'
						toggles name="${this._button6Name}"
						@click=${this.setPercentage}
						.disabled=${this._button6State}>${this._button6Text}</button>
					<button
						class='percentage'
						style='${this._button7Color};min-width:${this._width};max-width:${this._width};height:${this._height};${this._button7}'
						toggles name="${this._button7Name}"
						@click=${this.setPercentage}
						.disabled=${this._button7State}>${this._button7Text}</button>
				</div>
			</hui-generic-entity-row>
		`;
	}

	firstUpdated() {
		super.firstUpdated();
		this.shadowRoot.getElementById('button-container').addEventListener('click', (ev) => ev.stopPropagation());
	}

	setConfig(config) {
		this._config = { ...this._config, ...config };
	}

	updated(changedProperties) {
		if (changedProperties.has("hass")) {
			this.hassChanged();
		}
	}

	hassChanged() {
		const config = this._config;
		const stateObj = this.hass.states[config.entity];
		const custTheme = config.customTheme;
		const custSetpoint = config.customSetpoints;
		const revButtons = config.reverseButtons;
		const hide_OffButton = config.hideOffButton;
		const hide_Button1 = config.hideButton1;
		const hide_Button2 = config.hideButton2;
		const hide_Button3 = config.hideButton2;
		const hide_Button4 = config.hideButton3;
		const hide_Button5 = config.hideButton5;
		const hide_Button6 = config.hideButton6;
		const sendStateWithSpeed = config.sendStateWithSpeed;
		const allowDisable = config.allowDisablingButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const On1Clr = config.speed1Color;
		const On2Clr = config.speed2Color;
		const On3Clr = config.speed3Color;
		const On4Clr = config.speed4Color;
		const On5Clr = config.speed5Color;
		const On6Clr = config.speed6Color;
		const OffClr = config.isOffColor;
		const buttonOffClr = config.buttonInactiveColor;
		const custOffTxt = config.customOffText;
		const cus1Text = config.speed1Text;
		const cus2Text = config.speed2Text;
		const cus3Text = config.speed3Text;
		const cus4Text = config.speed4Text;
		const cus5Text = config.speed5Text;
		const cus6Text = config.speed6Text;

//		const ButtonOffSetpoint = config.buttonOffPercentage;
//		const Button1Setpoint = config.button1Percentage;
//		const Button2Setpoint = config.button2Percentage;
//		const Button3Setpoint = config.button3Percentage;
//		const Button4Setpoint = config.button4Percentage;
//		const Button5Setpoint = config.button5Percentage;
//		const Button6Setpoint = config.button6Percentage;

		let ButtonOffSetpoint;
		let Button1Setpoint;
		let Button2Setpoint;
		let Button3Setpoint;
		let Button4Setpoint;
		let Button5Setpoint;
		let Button6Setpoint;
		let button1;
		let button2;
		let button3;
		let button4;
		let button5;
		let button6;
		let offstate;
		let button1Display;
		let button2Display;
		let button3Display;
		let button4Display;
		let button5Display;
		let button6Display;
		let buttonOffDisplay;

		if (custSetpoint) {
			ButtonOffSetpoint = parseInt(config.buttonOffPercentage);
			if (parseInt(config.button1Percentage) < 1) {
				Button1Setpoint = 1;
			} else {
				Button1Setpoint =  parseInt(config.button1Percentage);
			}
			Button2Setpoint = parseInt(config.button2Percentage);
			Button3Setpoint = parseInt(config.button3Percentage);
			Button4Setpoint = parseInt(config.button4Percentage);
			Button5Setpoint = parseInt(config.button5Percentage);
			if (parseInt(config.button6Percentage) > 100) {
				Button6Setpoint = 100;
			} else {
				Button6Setpoint = parseInt(config.button6Percentage);
			}
		} else {
			ButtonOffSetpoint = 0; //parseInt(ButtonOffSetpoint);
			Button1Setpoint = 16;  //parseInt(Button1Setpoint);
			Button2Setpoint = 33;  //parseInt(Button2Setpoint);
			Button3Setpoint = 50;  //parseInt(Button3Setpoint);
			Button4Setpoint = 66;  //parseInt(Button4Setpoint);
			Button5Setpoint = 83;  //parseInt(Button5Setpoint);
			Button6Setpoint = 100; //parseInt(Button6Setpoint);
		}
		if (stateObj && stateObj.attributes) {
			if (stateObj.state == 'on' && stateObj.attributes.percentage > ButtonOffSetpoint && stateObj.attributes.percentage <= Button1Setpoint) {
				button1 = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > Button1Setpoint && stateObj.attributes.percentage <= Button2Setpoint) {
				button2 = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > Button2Setpoint && stateObj.attributes.percentage <= Button3Setpoint) {
				button3 = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > Button3Setpoint && stateObj.attributes.percentage <= Button4Setpoint) {
				button4 = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > Button4Setpoint && stateObj.attributes.percentage <= Button5Setpoint) {
				button5 = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > Button5Setpoint && stateObj.attributes.percentage <= Button6Setpoint) {
				button6 = 'on';
			} else {
				offstate = 'on';
			}
		}
		

		let button1color;
		let button2color;
		let button3color;
		let button4color;
		let button5color;
		let button6color;
		let offcolor;

		if (custTheme) {
			if (button1 == 'on') {
				button1color = 'background-color:' + On1Clr;
			} else {
				button1color = 'background-color:' + buttonOffClr;
			}
			if (button2 == 'on') {
				button2color = 'background-color:'  + On2Clr;
			} else {
				button2color = 'background-color:' + buttonOffClr;
			}
			if (button3 == 'on') {
				button3color = 'background-color:'  + On3Clr;
			} else {
				button3color = 'background-color:' + buttonOffClr;
			}
			if (button4 == 'on') {
				button4color = 'background-color:'  + On4Clr;
			} else {
				button4color = 'background-color:' + buttonOffClr;
			}
			if (button5 == 'on') {
				button5color = 'background-color:'  + On5Clr;
			} else {
				button5color = 'background-color:' + buttonOffClr;
			}
			if (button6 == 'on') {
				button6color = 'background-color:'  + On6Clr;
			} else {
				button6color = 'background-color:' + buttonOffClr;
			}
			if (offstate == 'on') {
				offcolor = 'background-color:'  + OffClr;
			} else {
				offcolor = 'background-color:' + buttonOffClr;
			}
		} else {
			if (button1 == 'on') {
				button1color = 'background-color: var(--switch-checked-color)';
			} else {
				button1color = 'background-color: var(--switch-unchecked-color)';
			}
			if (button2 == 'on') {
				button2color = 'background-color: var(--switch-checked-color)';
			} else {
				button2color = 'background-color: var(--switch-unchecked-color)';
			}
			if (button3 == 'on') {
				button3color = 'background-color: var(--switch-checked-color)';
			} else {
				button3color = 'background-color: var(--switch-unchecked-color)';
			}
			if (button4 == 'on') {
				button4color = 'background-color: var(--switch-checked-color)';
			} else {
				button4color = 'background-color: var(--switch-unchecked-color)';
			}
			if (button5 == 'on') {
				button5color = 'background-color: var(--switch-checked-color)';
			} else {
				button5color = 'background-color: var(--switch-unchecked-color)';
			}
			if (button6 == 'on') {
				button6color = 'background-color: var(--switch-checked-color)';
			} else {
				button6color = 'background-color: var(--switch-unchecked-color)';
			}
			if (offstate == 'on') {
				offcolor = 'background-color: var(--switch-checked-color)';
			} else {
				offcolor = 'background-color: var(--switch-unchecked-color)';
			}
		}

		let offtext = custOffTxt;
		let button1text = cus1Text;
		let button2text = cus2Text;
		let button3text = cus3Text;
		let button4text = cus4Text;
		let button5text = cus5Text;
		let button6text = cus6Text;

		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;

		let offname = 'off';
		let button1name = '1';
		let button2name = '2';
		let button3name = '3';
		let button4name = '4';
		let button5name = '5';
		let button6name = '6';

		if (hide_Button1) {
			button1Display = 'display:none';
		} else {
			button1Display = 'display:block';
		}
		if (hide_Button2) {
			button2Display = 'display:none';
		} else {
			button2Display = 'display:block';
		}		
		if (hide_Button3) {
			button3Display = 'display:none';
		} else {
			button3Display = 'display:block';
		}		
		if (hide_Button4) {
			button4Display = 'display:none';
		} else {
			button4Display = 'display:block';
		}		
		if (hide_Button5) {
			button5Display = 'display:none';
		} else {
			button5Display = 'display:block';
		}		
		if (hide_Button6) {
			button6Display = 'display:none';
		} else {
			button6Display = 'display:block';
		}
		if (hide_OffButton) {
			buttonOffDisplay = 'display:none';
		} else {
			buttonOffDisplay = 'display:block';
		}

		this._stateObj = stateObj;
		this._width = buttonwidth;
		this._height = buttonheight;
		this._buttonOffSP = ButtonOffSetpoint;
		this._button1SP = Button1Setpoint;
		this._button2SP = Button2Setpoint;
		this._button3SP = Button3Setpoint;
		this._button4SP = Button4Setpoint;
		this._button5SP = Button5Setpoint;
		this._button6SP = Button6Setpoint;

		if (revButtons) {
			this._button1State = (offstate == 'on' && allowDisable);
			this._button2State = (button1 === 'on' && allowDisable);
			this._button3State = (button2 === 'on' && allowDisable);
			this._button4State = (button3 === 'on' && allowDisable);
			this._button5State = (button4 === 'on' && allowDisable);
			this._button6State = (button5 === 'on' && allowDisable);
			this._button7State = (button6 === 'on' && allowDisable);
			this._button1Color = offcolor;
			this._button2Color = button1color;
			this._button3Color = button2color;
			this._button4Color = button3color;
			this._button5Color = button4color;
			this._button6Color = button5color;
			this._button7Color = button6color;
			this._button1Text = offtext;
			this._button2Text = button1text;
			this._button3Text = button2text;
			this._button4Text = button3text;
			this._button5Text = button4text;
			this._button6Text = button5text;
			this._button7Text = button6text;
			this._button1Name = offname;
			this._button2Name = button1name;
			this._button3Name = button2name;
			this._button4Name = button3name;
			this._button5Name = button4name;
			this._button6Name = button5name;
			this._button7Name = button6name;
			this._button1 = buttonOffDisplay;
			this._button2 = button1Display;
			this._button3 = button2Display;
			this._button4 = button3Display;
			this._button5 = button4Display;
			this._button6 = button5Display;
			this._button7 = button6Display;
		} else {
			this._button1State = (button6  === 'on' && allowDisable);
			this._button2State = (button5  === 'on' && allowDisable);
			this._button3State = (button4  === 'on' && allowDisable);
			this._button4State = (button3  === 'on' && allowDisable);
			this._button5State = (button2  === 'on' && allowDisable);
			this._button6State = (button1  === 'on' && allowDisable);
			this._button6State = (offstate === 'on' && allowDisable);
			this._button1Color = button6color;
			this._button2Color = button5color;
			this._button3Color = button4color;
			this._button4Color = button3color;
			this._button5Color = button2color;
			this._button6Color = button1color;
			this._button7Color = offcolor;
			this._button1Text = button6text;
			this._button2Text = button5text;
			this._button3Text = button4text;
			this._button4Text = button3text;
			this._button5Text = button2text;
			this._button6Text = button1text;
			this._button7Text = offtext;
			this._button1Name = button6name;
			this._button2Name = button5name;
			this._button3Name = button4name;
			this._button4Name = button3name;
			this._button5Name = button2name;
			this._button6Name = button1name;
			this._button7Name = offname;
			this._button1 = button6Display;
			this._button2 = button5Display;
			this._button3 = button4Display;
			this._button4 = button3Display;
			this._button5 = button2Display;
			this._button6 = button1Display;
			this._button7 = buttonOffDisplay;
		}
	}

	setPercentage(e) {
		const level = e.currentTarget.getAttribute('name');
		const param = { entity_id: this._config.entity };

		if( level == 'off' ) {
			this.hass.callService('fan', 'turn_off', param);
		} else if (level == '1') {
			if(this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', {entity_id: this._config.entity, percentage: this._button1SP});
			} else {
				param.percentage = this._button1SP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == '2') {
			if(this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', {entity_id: this._config.entity, percentage: this._button2SP});
			} else {
				param.percentage = this._button2SP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == '3') {
			if(this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', {entity_id: this._config.entity, percentage: this._button3SP});
			} else {
				param.percentage = this._button3SP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == '4') {
			if(this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', {entity_id: this._config.entity, percentage: this._button4SP});
			} else {
				param.percentage = this._button4SP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == '5') {
			if(this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', {entity_id: this._config.entity, percentage: this._button5SP});
			} else {
				param.percentage = this._button5SP;
				this.hass.callService('fan', 'set_percentage', param);
			}						
		} else if (level == '6') {
			if(this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', {entity_id: this._config.entity, percentage: this._button6SP});
			} else {
				param.percentage = this._button6SP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} 
	}
}

customElements.define('fan-percent-button-7row', CustomFanPercent7Row);
