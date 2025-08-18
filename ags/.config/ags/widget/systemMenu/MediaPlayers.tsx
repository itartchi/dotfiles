import {Gtk} from "astal/gtk3"
import Mpris from "gi://AstalMpris"
import {bind, Variable} from "astal"

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}


function MediaPlayer({ player, playerType = "widget" }: { player: Mpris.Player, playerType?: "popup" | "widget" }) {
    const { START, END, CENTER } = Gtk.Align

    const title = bind(player, "title").as(t =>
        t || "Unknown Track")

    const artist = bind(player, "artist").as(a =>
        a || "Unknown Artist")

    // player.position will keep changing even when the player is paused.  This is a workaround
    const realPosition = Variable(player.position)
    bind(player, "position").subscribe((position) => {
        if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING) {
            realPosition.set(position)
        }
    })

    const playIcon = bind(player, "playbackStatus").as(s =>
        s === Mpris.PlaybackStatus.PLAYING
            ? "⏸"
            : "▶"
    )

    const img = () => {
        if (playerType === "widget") {
            // For widget type, return empty box or small album art
            return <box></box>;
        }
    
        // For popup type, show the album cover image
        return (
            <box
                valign={Gtk.Align.CENTER}
                child={
                    <box
                        className="img"
                        css={bind(player, "coverArt").as(
                            (p) => `
                                background-image: url('${p}');
                                background-size: cover;
                                background-position: center;
                                background-repeat: no-repeat;
                                min-width: 80px;
                                min-height: 80px;
                                border-radius: 8px;
                                box-shadow: 0 0 5px 0 rgba(0,0,0,0.3);
                            `
                        )}
                    />
                }
            />
        );
    };

    return <box
        className="mediaPlayer"
        vertical={true}
        css={bind(player, "coverArt").as((p) =>
            playerType === "widget"
                ? `
                    background-image: url('${p}');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    border-radius: 12px;
                    padding: 16px;
                    min-height: 200px;
                    position: relative;
                  `
                : `
                    padding: 16px;
                    border-radius: 12px;
                  `
        )}
    >
        {/* Background overlay for better text readability when using background image */}
        {playerType === "widget" && (
            <box 
                className="overlay"
                css={`
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
                    border-radius: 12px;
                    pointer-events: none;
                `}
            />
        )}
        
        {/* Show album art for popup type */}
        {playerType === "popup" && img()}
        
        <box vertical={true} css="position: relative; z-index: 1;">
            <label
                className="labelSmallBold"
                truncate={true}
                halign={CENTER}
                label={title}
                css={playerType === "widget" ? "color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.8);" : ""}
            />
            <label
                className="labelSmall"
                truncate={true}
                halign={CENTER}
                label={artist}
                css={playerType === "widget" ? "color: rgba(255,255,255,0.9); text-shadow: 0 1px 2px rgba(0,0,0,0.8);" : ""}
            />
            <box
                className="seekContainer"
                vertical={false}>
                <label
                    className="labelSmall"
                    halign={START}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={realPosition().as(lengthStr)}
                    css={playerType === "widget" ? "color: rgba(255,255,255,0.9);" : ""}
                />
                <slider
                    className="seek"
                    hexpand={true}
                    visible={bind(player, "length").as(l => l > 0)}
                    onDragged={({value}) => {
                        player.position = value * player.length
                        realPosition.set(player.position)
                    }}
                    value={realPosition().as((position) => {
                        return player.length > 0 ? position / player.length : 0
                    })}
                />
                <label
                    className="labelSmall"
                    halign={END}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "length").as(l => l > 0 ? lengthStr(l) : "0:00")}
                    css={playerType === "widget" ? "color: rgba(255,255,255,0.9);" : ""}
                />
            </box>
            <box halign={CENTER}>
                <button
                    className="controlButton"
                    onClicked={() => {
                        if (player.shuffleStatus === Mpris.Shuffle.ON) {
                            player.set_shuffle_status(Mpris.Shuffle.OFF)
                        } else {
                            player.set_shuffle_status(Mpris.Shuffle.ON)
                        }
                    }}
                    visible={bind(player, "shuffleStatus").as((shuffle) => shuffle !== Mpris.Shuffle.UNSUPPORTED)}
                    label={bind(player, "shuffleStatus").as((shuffle) => {
                        if (shuffle === Mpris.Shuffle.ON) {
                            return "🔀"
                        } else {
                            return "➡️"
                        }
                    })}
                    css={playerType === "widget" ? "color: rgba(255,255,255,0.9);" : ""}
                />
                <button
                    className="controlButton"
                    onClicked={() => player.previous()}
                    visible={bind(player, "canGoPrevious")}
                    label="⏮"
                    css={playerType === "widget" ? "color: rgba(255,255,255,0.9);" : ""}
                />
                <button
                    className="controlButton"
                    onClicked={() => player.play_pause()}
                    visible={bind(player, "canControl")}
                    label={playIcon}
                    css={playerType === "widget" ? "color: white; font-size: 1.2em;" : ""}
                />
                <button
                    className="controlButton"
                    onClicked={() => player.next()}
                    visible={bind(player, "canGoNext")}
                    label="⏭"
                    css={playerType === "widget" ? "color: rgba(255,255,255,0.9);" : ""}
                />
                <button
                    className="controlButton"
                    onClicked={() => {
                        if (player.loopStatus === Mpris.Loop.NONE) {
                            player.set_loop_status(Mpris.Loop.PLAYLIST)
                        } else if (player.loopStatus === Mpris.Loop.PLAYLIST) {
                            player.set_loop_status(Mpris.Loop.TRACK)
                        } else {
                            player.set_loop_status(Mpris.Loop.NONE)
                        }
                    }}
                    visible={bind(player, "loopStatus").as((status) => status !== Mpris.Loop.UNSUPPORTED)}
                    label={bind(player, "loopStatus").as((status) => {
                        if (status === Mpris.Loop.NONE) {
                            return "↩️"
                        } else if (status === Mpris.Loop.PLAYLIST) {
                            return "🔁"
                        } else {
                            return "🔂"
                        }
                    })}
                    css={playerType === "widget" ? "color: rgba(255,255,255,0.9);" : ""}
                />
            </box>
        </box>
    </box>
}

export default function () {
    const mpris = Mpris.get_default()
    return <box
        className="mediaPlayersContainer"
        vertical={true}>
        {bind(mpris, "players").as(players => {
            return players.map(player => (
                <MediaPlayer player={player} playerType="widget" />
            ))
        })}
    </box>
}