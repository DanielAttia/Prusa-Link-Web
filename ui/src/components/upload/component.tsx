// This file is part of Prusa-Connect-Web
// Copyright (C) 2018-2019 Prusa Research s.r.o. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { h, Component, createRef } from "preact";
// import { Text } from "preact-i18n";
import "./style.scss";

import Static from "./static";
import Dynamic from "./dynamic";

interface P {
  url: string;
  path: string;
}

interface S {
  active: boolean;
  progress: { [index: string]: number };
}

class Upload extends Component<P, S> {
  ref = createRef();
  state = {
    active: false,
    progress: {}
  };

  handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prev => ({ ...prev, active: true }));
  };

  handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prev => ({ ...prev, active: false }));
  };

  handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prev => ({ ...prev, active: true }));
  };

  handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let dt = e.dataTransfer;
    let files = dt.files;
    this.setState(prev => ({ ...prev, active: false }));
    this.handleFiles(files);
  };

  onclickFile = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fileInput = this.ref.current;
    if (e.isTrusted && fileInput) {
      fileInput.click();
    }
  };

  handleInput = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    // @ts-ignore
    const files = e.target.files;
    if (files) this.handleFiles(files);
  };

  handleFiles = files => {
    [...files].forEach(this.uploadFile);
  };

  uploadFile = (file: File) => {
    let { url, path } = this.props;
    url = url ? url : "/api/files/local";
    path = path ? path : "";
    const index = url + path + file.name;

    const formData = new FormData();
    formData.append("path", path);
    formData.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader("X-Api-Key", process.env.APIKEY);

    request.onprogress = function(e: ProgressEvent) {
      that.setState(prev => {
        const progress = prev.progress;
        progress[index] = e.total ? e.total / e.total : 0;
        return { ...prev, progress: progress };
      });
    };

    const that = this;
    request.onloadstart = function(e: ProgressEvent) {
      that.setState(prev => {
        const progress = prev.progress;
        progress[index] = 0;
        return { ...prev, progress: progress };
      });
    };

    request.onloadend = function(e: ProgressEvent) {
      that.setState(prev => {
        const progress = prev.progress;
        let n = Object.keys(progress).length;
        let total = 0;
        for (let path in progress) {
          total = total + progress[path];
        }
        if (total == n) {
          return { ...prev, progress: {} };
        }
        return { ...prev };
      });
    };

    request.send(formData);
  };

  render({}, { active, progress }) {
    return (
      <div
        class="columns is-multiline is-mobile"
        onDrop={e => this.handleDrop(e)}
        onDragOver={e => this.handleDragOver(e)}
        onDragEnter={e => this.handleDragEnter(e)}
        onDragLeave={e => this.handleDragLeave(e)}
      >
        <div class="column is-full prusa-title-upload">
          <p class="subtitle is-size-2 is-size-4-desktop has-text-grey is-marginless prusa-line-upload">
            upload project
          </p>
        </div>
        <div class="column is-10 is-offset-1">
          {Object.keys(progress).length > 0 ? (
            <Dynamic progress={progress} />
          ) : (
            <Static active={active} onclickFile={this.onclickFile} />
          )}
        </div>
        <input
          ref={this.ref}
          style="display:none"
          type="file"
          multiple
          onInput={e => this.handleInput(e)}
        />
      </div>
    );
  }
}

export default Upload;
