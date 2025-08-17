import { App, Astal } from "astal/gtk3"
import {bind} from "astal"
import {Gtk, Gdk} from "astal/gtk3"
import NotificationHistory from "./NotificationHistory";

export const NotificationMenuWindowName = "notificationMenu"

export default function(){
    let window: Gtk.Window
    
    return <window
        exclusivity={Astal.Exclusivity.NORMAL}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT }
        layer={Astal.Layer.TOP}
        css={`background: transparent;`}
        name={NotificationMenuWindowName}
        application={App}
        margin={5}
        keymode={Astal.Keymode.ON_DEMAND}
        visible={false}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape) {
                self.hide()
            }
        }}
        setup={(self) => {
            window = self
        }}>
            <box
                vertical={true}>
                <box
                    vertical={true}
                    setup={(self) => {
                        setTimeout(() => {
                            bind(window, "hasToplevelFocus").subscribe((hasFocus) => {
                                if (hasFocus) {
                                    self.className = "focusedWindow"
                                } else {
                                    self.className = "window"
                                }
                            })
                        }, 1_000)
                    }}>
                        <NotificationHistory/>
                    </box>
            </box>
        </window>
}