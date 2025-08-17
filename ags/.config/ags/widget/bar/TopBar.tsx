import {App, Astal, Gtk} from "astal/gtk3"
import {
    BatteryButton,
    BluetoothButton,
    ClockButton,
    MenuButton,
    NetworkButton,
    NotificationMenuButton,
    SysTray,
    Workspaces
} from "./BarWidgets";

export default function () {
    let iconCss = ""

    return <window
        css={`background: transparent;`}
        monitor={0}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        margin={5}
        anchor={Astal.WindowAnchor.TOP
            | Astal.WindowAnchor.LEFT
            | Astal.WindowAnchor.RIGHT}
        application={App}>
        <centerbox
            className="window"
            css={`
                padding: 2px;
                min-height: 40px;
            `}>
            <box halign={Gtk.Align.START}>
                <MenuButton css={""}/>
               
            </box>
            <box>
                <Workspaces vertical={false}/>
                
            </box>
            <box halign={Gtk.Align.END}>
                {/* <ScreenRecordingButton css={iconCss}/>
                <VolumeButton css={iconCss}/>
                <MicrophoneButton css={iconCss}/> */}
                <SysTray />
                <BluetoothButton css={iconCss}/>
                {/* <VpnButton css={iconCss}/> */}
                <NetworkButton css={iconCss}/>
                <NotificationMenuButton/>
                <BatteryButton css={iconCss}/>
                <ClockButton css={""} singleLine={true}/>
            </box>
        </centerbox>
    </window>
}
