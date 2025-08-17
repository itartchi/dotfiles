import {App, Gtk} from "astal/gtk3"
import {SystemMenuWindowName} from "./SystemMenuWindow";
import {execAsync, exec} from "astal/process"

export default function () {
    return <box
        vertical={false}
        className="row"
        halign={Gtk.Align.CENTER}>
        <button
            tooltipText={"AGS Code/ Settings"}
            className="systemMenuIconButton"
            label=""
            onClicked={() => {
                App.toggle_window(SystemMenuWindowName)
                exec(["bash", "-c" ,"cd ~/.config/ags && code ."])
            }}/>
        <button
            tooltipText={"UWSM STOP"}
            className="systemMenuIconButton"
            label="󰍃"
            onClicked={() => {
                App.toggle_window(SystemMenuWindowName)
                execAsync("uwsm stop")
            }}/>
        <button
            tooltipText={"Logout Screen"}
            className="systemMenuIconButton"
            label=""
            onClicked={() => {
                App.toggle_window(SystemMenuWindowName)
                execAsync("wlogout")
            }}/>
        <button
            tooltipText={"Restart"}
            className="systemMenuIconButton"
            label=""
            onClicked={() => {
                App.toggle_window(SystemMenuWindowName)
                execAsync("systemctl reboot")
            }}/>
        <button
            tooltipText={"Poweroff"}
            className="systemMenuIconButton"
            label="⏻"
            onClicked={() => {
                App.toggle_window(SystemMenuWindowName)
                execAsync("systemctl poweroff")
            }}/>
    </box>
}