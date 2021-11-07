import { css, cx } from "@linaria/core";
import React, { useMemo, useState } from "react";
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
  const offer = useMemo(() => (offers ? getAvailableMarketOfferById(offers, parsedId) : undefined), [offers, parsedId]);
  const options = useData(async () => {
    if (parsedId) {
      const gremlin = await getGremlinById(parsedId);

      return { gremlin };
    }
  }, [id]);
  const [modalVisible, setModalVisible] = useState(false);
  const { triggerer: makeOffer } = useSubmission(async (data?: { price: number }) => {
    const { price } = data!;

    await makeOfferById(parsedId, price, walletAddress!);
    await updateOffers();

    Toast.show("Make offer successful!");
  });

  const { triggerer: cancelOffer } = useSubmission(async (data?: { offerId: number }) => {
    const { offerId } = data!;

    await cancelOfferById(offerId, walletAddress!);
    await updateOffers();

    Toast.show("Cancel offer successful!");
  });

  const { triggerer: fillOffer } = useSubmission(async (data?: { offerId: number; price: number }) => {
    const { offerId, price } = data!;
    await fillOfferById(offerId, walletAddress!, price);
    await updateOffers();
    await options.retry();

    Toast.show("Fill offer successful!");
  });

  return (
    <Loading
      skipDataChecking
      options={options}
      render={(data) => {
        if (!data || !data.gremlin) {
          return <FullScreenTips type="warning" mainTips="Something went wrong" />;
        }

        const { gremlin } = data;
        const { owner, metaData, id } = gremlin;
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
                        cancelOffer({ offerId: offer.offerId });
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
                      fillOffer({ offerId: offer.offerId, price: offer.price });
                    },
                  });
                }}>
                Buy
              </Button>
            ) : null}
            <OfferModal
              visible={modalVisible}
              onOk={(price: number) => {
                makeOffer({ price });

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
