// This file is part of Prusa-Connect-Local
// Copyright (C) 2018-2019 Prusa Research s.r.o. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { h, Fragment } from "preact";
import { useTranslation } from "react-i18next";
import { numberFormat, formatTime, formatEstimatedTime } from "../utils/format";
import StatusBoardItem from "./board-item";

interface P {
  readonly remaining_time: number;
  readonly time_elapsed: number;
  readonly current_layer: number;
  readonly total_layers: number;
  readonly remaining_material: number;
  readonly consumed_material: number;
  readonly time_zone: number;
}

export const initState = {
  remaining_time: 0,
  time_elapsed: 0,
  current_layer: 0,
  total_layers: 0,
  remaining_material: 0,
  consumed_material: 0,
  time_zone: 0
};

export const StatusBoardSL1: preact.FunctionalComponent<P> = ({
  remaining_time,
  time_elapsed,
  current_layer,
  total_layers,
  remaining_material,
  consumed_material,
  time_zone
}) => {
  const { t, i18n, ready } = useTranslation(null, { useSuspense: false });
  return ready ? (
    <Fragment>
      <div class="columns">
        <StatusBoardItem
          title={t("prop.rem-time").toLowerCase()}
          value={formatTime(remaining_time, t)}
        />
        <StatusBoardItem
          title={t("prop.est-end").toLowerCase()}
          value={formatEstimatedTime(remaining_time, time_zone, t)}
        />
        <StatusBoardItem
          title={t("prop.pnt-time").toLowerCase()}
          value={formatTime(time_elapsed, t)}
        />
      </div>
      <div class="columns">
        <StatusBoardItem
          title={t("prop.layers").toLowerCase()}
          value={total_layers > 0 ? `${current_layer}/${total_layers}` : "0/0"}
        />
        <StatusBoardItem
          title={t("prop.sla-rmn-mt").toLowerCase()}
          value={
            remaining_material > 0
              ? numberFormat(remaining_material) + " " + t("unit.ml")
              : "NA"
          }
        />
        <StatusBoardItem
          title={t("prop.sla-csm-mt").toLowerCase()}
          value={
            consumed_material > 0
              ? numberFormat(consumed_material) + " " + t("unit.ml")
              : "NA"
          }
        />
      </div>
    </Fragment>
  ) : (
    <Fragment />
  );
};
