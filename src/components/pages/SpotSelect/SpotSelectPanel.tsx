import YoutubeUtil, { YoutubeChannel } from "@/libs/util/YoutubeUtil";
import { Input, Spin } from "antd";
import { useState } from "react";
import SpotCard from "./SpotCard";
import styles from "./SpotSelectPanel.module.css";

const SpotSelectPanel = () => {
  const [keyword, setKeyword] = useState("");
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    const channelData = await YoutubeUtil.searchChannelByKeyword(keyword);
    console.log(channelData);
    setChannels(Array.isArray(channelData) ? channelData : [channelData]);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Spin fullscreen />;
  }

  return (
    <>
      <Input.Search
        placeholder="Enter YouTube channel keyword"
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className={styles.content}>
        {channels.map((channel) => (
          <div key={channel.snippet.channelId} className={styles.content}>
            <SpotCard spot={channel} />
          </div>
        ))}
        {channels.length === 0 && !isLoading && <div>No channels found</div>}
      </div>
    </>
  );
};

export default SpotSelectPanel;
