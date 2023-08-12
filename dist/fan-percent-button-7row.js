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
			isTwoSpeedFan: false,
			hideOff: false,
			sendStateWithSpeed: false,
			allowDisablingButtons: true,
			offPercentage: 0,
			button1Percentage: 33,
			button2Percentage: 66,
			button3Percentage: 100,
			width: '30px',
			height: '30px',
			isOffColor: '#f44c09',
			speed1Color: '#43A047',
			speed2Color: '#43A047',
			speed3Color: '#43A047',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			speed1Text: '1',
			speed2Text: '2',
			speed3Text: '3',
		};
	}

	static get properties() {
		return {
			hass: Object,
			_config: Object,
			_stateObj: Object,
			_offSP: Number,
			_button1SP: Number,
			_button2SP: Number,
			_button3SP: Number,
			_width: String,
			_height: String,
			_button1Color: String,
			_button2Color: String,
			_button3Color: String,
			_button4Color: String,
			_button1Text: String,
			_button2Text: String,
			_button3Text: String,
			_button4Text: String,
			_button1Name: String,
			_button2Name: String,
			_button3Name: String,
			_button4Name: String,
			_button1: String,
			_button2: String,
			_button3: String,
			_button4: String,
			_button1State: Boolean,
			_button2State: Boolean,
			_button3State: Boolean,
			_button4State: Boolean,
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
		const twoSpdFan = config.isTwoSpeedFan;
		const hide_Off = config.hideOff;
		const sendStateWithSpeed = config.sendStateWithSpeed;
		const allowDisable = config.allowDisablingButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const On1Clr = config.speed1Color;
		const On2Clr = config.speed2Color;
		const On3Clr = config.speed3Color;
		const OffClr = config.isOffColor;
		const buttonOffClr = config.buttonInactiveColor;
		const OffSetpoint = config.offPercentage;
		const Button1Setpoint = config.button1Percentage;
		const Button2Setpoint = config.button2Percentage;
		const Button3Setpoint = config.button3Percentage;
		const custOffTxt = config.customOffText;
		const cus1Text = config.speed1Text;
		const cus2Text = config.speed2Text;
		const cus3Text = config.speed3Text;

		let offSetpoint;
		let Button1Setpoint;
		let Button2Setpoint;
		let Button3Setpoint;
		let button1;
		let button2;
		let button3;
		let offstate;

		if (custSetpoint) {
			offSetpoint = parseInt(OffSetpoint);
			Button2Setpoint = parseInt(Button2Setpoint);
			if (parseInt(Button1Setpoint) < 1) {
				Button1Setpoint = 1;
			} else {
				Button1Setpoint =  parseInt(Button1Setpoint);
			}
			if (parseInt(Button3Setpoint) > 100) {
				Button3Setpoint = 100;
			} else {
				Button3Setpoint = parseInt(Button3Setpoint);
			}
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.percentage > offSetpoint && stateObj.attributes.percentage <= ((Button2Setpoint + Button1Setpoint)/2) ) {
					button1 = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((Button2Setpoint + Button1Setpoint)/2) && stateObj.attributes.percentage <= ((Button3Setpoint + Button2Setpoint)/2) ) {
					button2 = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage > ((Button3Setpoint + Button2Setpoint)/2) && stateObj.attributes.percentage <= 100) {
					button3 = 'on';
				} else {
					offstate = 'on';
				}
			}
		} else {
			offSetpoint = 0 //parseInt(OffSetpoint);
			Button1Setpoint = 33 //parseInt(Button1Setpoint);
			Button2Setpoint = 66 //parseInt(Button2Setpoint);
			Button3Setpoint = 100 //parseInt(Button3Setpoint);
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.percentage >= 17 && stateObj.attributes.percentage <= 50) {
					button1 = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 51 && stateObj.attributes.percentage <= 75) {
					button2 = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.percentage >= 76 && stateObj.attributes.percentage <= 100) {
					button3 = 'on';
				} else {
					offstate = 'on';
				}
			}
		}

		let button1color;
		let button2color;
		let button3color;
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

		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;

		let offname = 'off'
		let button1name = '1'
		let button2name = '2'
		let button3name = '3'

		let hideoff = 'display:block';
		let hidebutton = 'display:block';
		let nohide = 'display:block';

		if (twoSpdFan) {
			hidebutton = 'display:none';
		} else {
			hidebutton = 'display:block';
		}

		if (hide_Off) {
			hideoff = 'display:none';
		} else {
			hideoff = 'display:block';
		}

		this._stateObj = stateObj;
		this._width = buttonwidth;
		this._height = buttonheight;
		this._offSP = offSetpoint;
		this._button1SP = Button1Setpoint;
		this._button2SP = Button2Setpoint;
		this._button3SP = Button3Setpoint;

		if (revButtons) {
			this._button1State = (offstate == 'on' && allowDisable);
			this._button2State = (button1 === 'on' && allowDisable);
			this._button3State = (button2 === 'on'&& allowDisable);
			this._button4State = (button3 === 'on' && allowDisable);
			this._button1Color = offcolor;
			this._button2Color = button1color;
			this._button3Color = button2color;
			this._button4Color = button3color;
			this._button1Text = offtext;
			this._button2Text = button1text;
			this._button3Text = button2text;
			this._button4Text = button3text;
			this._button1Name = offname;
			this._button2Name = button1name;
			this._button3Name = button2name;
			this._button4Name = button3name;
			this._button1 = hideoff;
			this._button2 = nohide;
			this._button3 = hidebutton;
			this._button4 = nohide;
		} else {
			this._button1State = (button3 === 'on' && allowDisable);
			this._button2State = (button2 === 'on'&& allowDisable);
			this._button3State = (button1 === 'on' && allowDisable);
			this._button4State = (offstate == 'on' && allowDisable);
			this._button1Color = button3color;
			this._button2Color = button2color;
			this._button3Color = button1color;
			this._button4Color = offcolor;
			this._button1Text = button3text;
			this._button2Text = button2text;
			this._button3Text = button1text;
			this._button4Text = offtext;
			this._button1Name = button3name;
			this._button2Name = button2name;
			this._button3Name = button1name;
			this._button4Name = offname;
			this._button4 = hideoff;
			this._button3 = nohide;
			this._button2 = hidebutton;
			this._button1 = nohide;
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
		}
	}
}

customElements.define('fan-percent-button-7row', CustomFanPercent7Row);
