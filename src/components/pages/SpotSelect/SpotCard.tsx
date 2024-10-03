import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import { YoutubeChannel } from "@/libs/util/YoutubeUtil";
import { Button, Card } from "antd";
import style from "./SpotCard.module.css";

export type SpotCardProps = {
  spot: YoutubeChannel;
};

const SpotCard = (props: SpotCardProps) => {
  const { spot } = props;
  const playerInfo = usePlayerInfoStore();

  const handleEnterRoom = () => {
    playerInfo.setYoutubeChannelInfo(spot);
  };

  return (
    <div className={style.cardArea}>
      <Card
        className={style.card}
        cover={<img alt="thumbnail" src={spot.snippet.thumbnails.high.url} />}
      >
        <p className={style.cardTitle}>{spot.snippet.channelTitle}</p>
        <p className={style.cardBody}>{spot.snippet.description}</p>
        <div className={style.cardButtonArea}>
          <Button
            onClick={handleEnterRoom}
            type="primary"
            className={style.cardButton}
          >
            Enter Room
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SpotCard;
