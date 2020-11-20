// This file is part of Prusa-Connect-Local
// Copyright (C) 2018-2019 Prusa Research s.r.o. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { h, Component } from "preact";
import { useTranslation } from "react-i18next";

import { network } from "../utils/network";
import { formatEstimatedTime, formatTime } from "../utils/format";

interface P extends network {
  printing_time: number;
  layer_height: number;
}

interface S {
  exposure_times: string;
  last_modified: string;
  total_layers: number | string;
  remaining_time: string;
  time_zone: string;
}

class Properties extends Component<P, S> {
  state = {
    exposure_times: "NA",
    last_modified: "NA",
    total_layers: "NA",
    remaining_time: null,
    time_zone: null
  };

  componentDidMount = () => {
    this.props.onFetch({
      url: "/api/before-confirm",
      then: response =>
        response.json().then(data => {
          if (data.total_layers) {
            const dt = new Date(data.last_modified);
            const last_modified = dt.toDateString() + " " + dt.toTimeString();
            const result = {
              exposure_times: data.exposure_times,
              last_modified: last_modified.substring(0, 25),
              total_layers: data.total_layers,
              time_zone: data.time_zone
            };
            this.setState(prevState => ({ ...prevState, ...result }));
          }
        })
    });
  };

  render(
    { printing_time, layer_height },
    { exposure_times, last_modified, total_layers, time_zone }
  ) {
    const { t, i18n, ready } = useTranslation(null, { useSuspense: false });
    return (
      ready && (
        <div class="columns is-multiline is-mobile">
          <div class="column is-full">
            <div class="columns">
              <div class="column proj-icon is-narrow">
                <img src={require("../../assets/time_color.svg")} />
              </div>
              <div class="column">
                <p class="txt-normal txt-size-2 txt-grey">
                  {t("prop.time-est")}
                </p>
                <p class="txt-bold txt-size-2">
                  {formatTime(printing_time, t)}
                </p>
              </div>
              <div class="column">
                <p class="txt-normal txt-size-2 txt-grey">
                  {t("prop.est-end")}
                </p>
                <p class="txt-bold txt-size-2">
                  {printing_time
                    ? formatEstimatedTime(printing_time, time_zone, t)
                    : t("prop.na")}
                </p>
              </div>
            </div>
          </div>

          <div class="column is-full">
            <div class="columns">
              <div class="column proj-icon is-narrow">
                <img src={require("../../assets/quality_medium.svg")} />
              </div>
              <div class="column">
                <p class="txt-normal txt-size-2 txt-grey">{t("prop.layers")}</p>
                <p class="txt-bold txt-size-2">{total_layers}</p>
              </div>
              <div class="column">
                <p class="txt-normal txt-size-2 txt-grey">
                  {t("prop.layer-ht")}
                </p>
                <p class="txt-bold txt-size-2">
                  {layer_height ? `${layer_height} mm` : "NA"}
                </p>
              </div>
            </div>
          </div>

          <div class="column is-full">
            <div class="columns">
              <div class="column proj-icon is-narrow">
                <img src={require("../../assets/exposure_times_color.svg")} />
              </div>
              <div class="column">
                <p class="txt-normal txt-size-2 txt-grey">
                  {t("prop.exp-times")}
                </p>
                <p class="txt-bold txt-size-2">{exposure_times}</p>
              </div>
            </div>
          </div>

          <div class="column is-full">
            <div class="columns">
              <div class="column proj-icon is-narrow">
                <img src={require("../../assets/calendar.svg")} />
              </div>
              <div class="column">
                <p class="txt-normal txt-size-2 txt-grey">
                  {t("prop.last-mod")}
                </p>
                <p class="txt-bold txt-size-2">{last_modified}</p>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}

export default Properties;
