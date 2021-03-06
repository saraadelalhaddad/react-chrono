import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TimelineItemModel } from '../models/TimelineItemModel';
import { TimelineProps } from '../models/TimelineModel';
import Timeline from './timeline/timeline';
import 'focus-visible';

const Chrono: React.FunctionComponent<Partial<TimelineProps>> = ({
  items,
  itemWidth = 300,
  mode = 'HORIZONTAL',
  disableNavOnKey = false,
  slideShow = false,
  slideItemDuration = 5000,
  theme = {
    primary: '#0f52ba',
    secondary: '#ffdf00',
  },
  cardHeight = 200,
  hideControls = false,
  scrollable = true,
  cardPositionHorizontal = 'BOTTOM',
}: Partial<TimelineProps>) => {
  const [timeLineItems, setItems] = useState<TimelineItemModel[]>([]);
  const timeLineItemsRef = useRef<TimelineItemModel[]>();
  const [slideShowActive, setSlideshowActive] = useState(false);
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);

  const initItems = () =>
    items
      ? items.map((item, index) => {
          return Object.assign({}, item, {
            id: nanoid(),
            visible: true,
            active: index === 0,
          });
        })
      : [];

  useEffect(() => {
    if (!items) {
      return;
    }

    if (slideShowActive && slideShow) {
      // setupSlideShow();
    }
    // eslint-disable-next-line
  }, [slideShowActive]);

  useEffect(() => {
    const items = initItems();
    timeLineItemsRef.current = items;
    setItems(items);
  }, []);

  const handleTimelineUpdate = (actvTimelineIndex: number) => {
    setItems((items) =>
      items.map((item, index) =>
        Object.assign({}, item, {
          active: index === actvTimelineIndex,
        }),
      ),
    );
    setActiveTimelineItem(actvTimelineIndex);

    if (items) {
      if (items.length - 1 === actvTimelineIndex) {
        setSlideshowActive(false);
      }
    }
  };

  const restartSlideShow = useCallback(() => {
    setSlideshowActive(true);
    handleTimelineUpdate(0);
  }, []);

  const handleOnNext = () => {
    if (!items) {
      return;
    }
    if (activeTimelineItem < items.length - 1) {
      const newTimeLineItem = activeTimelineItem + 1;

      handleTimelineUpdate(newTimeLineItem);
      setActiveTimelineItem(newTimeLineItem);
    }
  };

  const handleOnPrevious = () => {
    if (activeTimelineItem > 0) {
      const newTimeLineItem = activeTimelineItem - 1;

      handleTimelineUpdate(newTimeLineItem);
      setActiveTimelineItem(newTimeLineItem);
    }
  };

  const handleFirst = useCallback(() => {
    setActiveTimelineItem(0);
    handleTimelineUpdate(0);
  }, []);

  const handleLast = useCallback(() => {
    if (timeLineItems.length) {
      const idx = timeLineItems.length - 1;
      setActiveTimelineItem(idx);
      handleTimelineUpdate(idx);
    }
  }, [timeLineItems]);

  return (
    <Timeline
      activeTimelineItem={activeTimelineItem}
      disableNavOnKey={disableNavOnKey}
      itemWidth={itemWidth}
      items={timeLineItems}
      mode={mode}
      onFirst={handleFirst}
      onLast={handleLast}
      onNext={handleOnNext}
      onPrevious={handleOnPrevious}
      onRestartSlideshow={restartSlideShow}
      onTimelineUpdated={useCallback(handleTimelineUpdate, [])}
      slideItemDuration={slideItemDuration}
      slideShowRunning={slideShowActive}
      slideShowEnabled={slideShow}
      theme={theme}
      slideShow={slideShow}
      cardHeight={cardHeight}
      hideControls={hideControls}
      scrollable={scrollable}
      cardPositionHorizontal={cardPositionHorizontal}
    />
  );
};

export default Chrono;
