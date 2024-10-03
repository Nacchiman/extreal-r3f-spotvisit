import useMultiplayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import AvatarSelectDialog from "@/components/pages/AvatarSelect/AvatarSelectDialog";
import ParticipantInfoList from "@/components/pages/ParticipantList/ParticipantInfoList";
import MultiplayUtil from "@/libs/util/MultiplayUtil";
import { Button, Col, Input, Modal, Row, Typography } from "antd";
import { ConnectionState } from "livekit-client";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdHome } from "react-icons/io";
import {
  MdConnectWithoutContact,
  MdKeyboardArrowLeft,
  MdOutlineGroup,
  MdOutlineGroupAdd,
} from "react-icons/md";
import { TbPlugConnected, TbPlugConnectedX } from "react-icons/tb";
import styles from "./IconMenu.module.css";

const shortUuidUserName = MultiplayUtil.generateShortUUID();

const IconMenu = () => {
  const playerInfo = usePlayerInfoStore();
  const channel = useMultiplayChannelStore();
  const [isAvatarSelectOpen, setIsAvatarSelectOpen] = useState(false);
  const [isMultiplayOpen, setIsMultiplayOpen] = useState(false);
  const [isGroupListOpen, setIsGroupListOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove whitespaces
    const newValue = e.target.value.replace(/ /g, "");
    setGroupName(newValue);
  };

  const onOK = () => {
    setIsAvatarSelectOpen(false);
  };

  const onBack = () => {
    playerInfo.setYoutubeChannelInfo(undefined);
  };

  const ConnectStatusIcon = () => {
    switch (channel.connectStatus) {
      case ConnectionState.Connected:
        return <MdConnectWithoutContact className={styles.connectedIcon} />;
      case ConnectionState.Disconnected:
        return <MdOutlineGroupAdd />;
      case ConnectionState.Connecting:
        return <TbPlugConnected />;
      case ConnectionState.Reconnecting:
        return <TbPlugConnectedX />;
      default:
        break;
    }
  };

  return (
    <>
      <Row className={styles.header}>
        <Col span={8}>
          {playerInfo.youtubeChannelInfo && (
            <>
              <Button
                onClick={onBack}
                type="link"
                className={styles.backButton}
                icon={
                  <>
                    <MdKeyboardArrowLeft />
                    <IoMdHome />
                  </>
                }
              ></Button>
            </>
          )}
        </Col>
        <Col span={8} className={styles.title}>
          {playerInfo.youtubeChannelInfo ? (
            <p>{playerInfo.youtubeChannelInfo.snippet.title}</p>
          ) : (
            <p>Select Spot</p>
          )}
        </Col>
        <Col span={8} className={styles.iconButtonsCol}>
          {channel.isConnected && (
            <>
              <Button
                onClick={() => {
                  setIsGroupListOpen(true);
                }}
                type="link"
                className={styles.iconButton}
                icon={<MdOutlineGroup />}
                // Prevent to open modal by space key
                onKeyDown={(e) => e.preventDefault()}
              />
              <Modal
                open={isGroupListOpen}
                onCancel={() => {
                  setIsGroupListOpen(false);
                }}
                footer={[
                  <Button
                    key="close"
                    type="primary"
                    onClick={() => {
                      setIsGroupListOpen(false);
                    }}
                  >
                    Close
                  </Button>,
                ]}
                destroyOnClose
              >
                <ParticipantInfoList />
              </Modal>
            </>
          )}
          <Button
            onClick={() => {
              setIsMultiplayOpen(true);
            }}
            type="link"
            className={styles.iconButton}
            icon={ConnectStatusIcon()}
            // Prevent to open modal by space key
            onKeyDown={(e) => e.preventDefault()}
          />
          <Modal
            open={isMultiplayOpen}
            onOk={() => {
              if (channel.isConnected) {
                //Leave Multiplay Group
                playerInfo.setMultiplayGroupName(undefined);
                playerInfo.setMultiplayConnect(false);
                setGroupName("");
              } else {
                //Join Multiplay Group
                playerInfo.setMultiplayPlayerId(shortUuidUserName);
                playerInfo.setMultiplayGroupName(groupName);
                playerInfo.setMultiplayAudio(true);
                playerInfo.setMultiplayConnect(true);
              }
              setIsMultiplayOpen(false);
            }}
            onCancel={() => {
              if (!channel.isConnected) {
                setGroupName("");
              }
              setIsMultiplayOpen(false);
            }}
            okText={channel.isConnected ? "Leave" : "Join"}
            okButtonProps={{
              style: channel.isConnected
                ? { backgroundColor: "red", borderColor: "red", color: "white" }
                : {},
              disabled: !groupName,
            }}
            destroyOnClose
          >
            <Row gutter={8}>
              <Col span={24}>
                <Typography.Title level={5}>
                  {channel.isConnected
                    ? "Group Name"
                    : "Join or Create Multiplay Group"}
                </Typography.Title>
                <Input
                  // Prevent zoom when touch on mobile browser
                  size="large"
                  onChange={handleChange}
                  placeholder="Enter Group Name"
                  value={groupName}
                  disabled={channel.isConnected}
                />
              </Col>
            </Row>
          </Modal>
          <Button
            onClick={() => {
              setIsAvatarSelectOpen(true);
            }}
            type="link"
            className={styles.iconButton}
            icon={<HiDotsVertical />}
            // Prevent to open modal by space key
            onKeyDown={(e) => e.preventDefault()}
          />
          <AvatarSelectDialog open={isAvatarSelectOpen} onClose={onOK} />
        </Col>
      </Row>
    </>
  );
};

export default IconMenu;
