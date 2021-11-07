import { css, cx } from "@linaria/core";
import React, { useState } from "react";
import {
  cancelOfferById,
  fillOfferById,
  getAvailableMarketOfferById,
  getGremlinById,
  makeOfferById,
  parseId,
} from "../utils/common";
import { useData } from "../utils/hooks/use-data";
import { styleFlex, styleFlexDirectionColumn, styleFullWidthAndHeight } from "../utils/styles";
import { FullScreenTips } from "./common/full-screen-tips";
import { Loading } from "./common/loading";
import { Button, Dialog, Toast } from "antd-mobile";
import { useRexContext } from "../utils/store/store";
import { IStore, updateOffers } from "../utils/store";
import { OfferModal } from "./common/offer-modal";
import { useSubmission } from "../utils/hooks/use-submission";

interface IProps {
  id?: string;
}

export const GremlinDetail: React.SFC<IProps> = (props) => {
  const { id } = props;
  const parsedId = parseId(id);
  const { walletAddress, offers } = useRexContext((store: IStore) => store);
  const options = useData(async () => {
    if (parsedId) {
      const gremlin = await getGremlinById(parsedId);

      if (gremlin && offers) {
        const offer = getAvailableMarketOfferById(offers, parsedId);

        return { gremlin, offer };
      }
    }
  }, [id]);
  const [modalVisible, setModalVisible] = useState(false);
  const { triggerer: makeOffer } = useSubmission(async (price?: number) => {
    await makeOfferById(parsedId, price!, walletAddress!);
    await updateOffers();

    Toast.show("Make offer successful!");
  });

  const { triggerer: cancelOffer } = useSubmission(async () => {
    await cancelOfferById(parsedId, walletAddress!);
    await updateOffers();

    Toast.show("Cancel offer successful!");
  });

  const { triggerer: fillOffer } = useSubmission(async (price?: number) => {
    await fillOfferById(parsedId, walletAddress!, price!);
    await updateOffers();

    Toast.show("Fill offer successful!");
  });

  return (
    <Loading
      skipDataChecking
      options={options}
      render={(data) => {
        if (!data) {
          return <FullScreenTips type="warning" mainTips="Something went wrong" />;
        }

        const { gremlin, offer } = data;
        const { owner, metaData, tokenId } = gremlin;
        const ownerUser = offer ? offer.user : owner;
        const isMyGremlin = walletAddress === ownerUser;

        return (
          <div className={cx(styleFullWidthAndHeight, styleFlex, styleFlexDirectionColumn)}>
            {gremlin.metaData ? <img className={styleCover} src={gremlin.metaData.image} /> : null}
            {isMyGremlin ? (
              offer ? (
                <Button
                  block
                  color="danger"
                  onClick={() => {
                    Dialog.confirm({
                      content: "Are you sure to cancel the order?",
                      onConfirm: () => {
                        cancelOffer();
                      },
                    });
                  }}>
                  Cancel Order
                </Button>
              ) : (
                <Button
                  block
                  color="primary"
                  onClick={() => {
                    setModalVisible(true);
                  }}>
                  Make Offer
                </Button>
              )
            ) : offer ? (
              <Button
                block
                color="primary"
                onClick={() => {
                  Dialog.confirm({
                    content: "Are you sure to buy this gremlin?",
                    onConfirm: () => {
                      fillOffer(offer.price);
                    },
                  });
                }}>
                Buy
              </Button>
            ) : null}
            <OfferModal
              visible={modalVisible}
              onOk={(price: number) => {
                makeOffer(price);

                setModalVisible(false);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
            />
          </div>
        );
      }}
    />
  );
};

const styleCover = css`
  height: 20vw;
  width: 20vw;
  max-height: 100px;
  max-width: 100px;
`;
