// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import com.google.sps.Event;
import com.google.sps.MeetingRequest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> attendees = request.getAttendees();
    List<TimeRange> slotsAvailable = new ArrayList<TimeRange>();
    int duration = (int)request.getDuration();

    if (duration > TimeRange.WHOLE_DAY.duration()) {
      return slotsAvailable;
    }

    slotsAvailable.add(TimeRange.WHOLE_DAY);

    for (Event currentEvent : events) {
      Set<String> currentEventAttendees = currentEvent.getAttendees();
      boolean anyCommonAttendees = false;

      for (String currentEventAttendee : currentEventAttendees) {
        if (attendees.contains(currentEventAttendee)) {
          anyCommonAttendees = true;
          break;
        }
      }

      if (anyCommonAttendees) {
        TimeRange currentEventSlot = currentEvent.getWhen();
        Iterator iterator = slotsAvailable.iterator();

        List<TimeRange> newSlotsAvailable = new ArrayList<TimeRange>();

        while (iterator.hasNext()) {
          TimeRange slot = (TimeRange)iterator.next();

          // Case 1: |---| |---| - no overlap
          //
          // Case 2: |---|          |---|      - slot
          //            |---| or |---|         - currentEventSlot
          //    =>   |-|              |-|
          //
          // Case 3: |---------|       |---|    - slot
          //            |---|    or |---------| - currentEventSlot
          //    =>   |-|     |-|    |-|     |-|
          
          if (slot.overlaps(currentEventSlot)) {
            int excludeSlotStart = Math.max(slot.start(), currentEventSlot.start());
            int excludeSlotEnd = Math.min(slot.end(), currentEventSlot.end());

            iterator.remove();
            
            int leftSlotStart = slot.start();
            int leftSlotEnd = excludeSlotStart;
            int leftSlotDuration = leftSlotEnd - leftSlotStart;

            if (leftSlotDuration >= duration) {
              newSlotsAvailable.add(TimeRange.fromStartEnd(leftSlotStart, leftSlotEnd, false));
            }

            int rightSlotStart = excludeSlotEnd;
            int rightSlotEnd = slot.end();
            int rightSlotDuration = rightSlotEnd - rightSlotStart;

            if (rightSlotDuration >= duration) {
              newSlotsAvailable.add(TimeRange.fromStartEnd(rightSlotStart, rightSlotEnd, false));
            }
          }
        }

        slotsAvailable.addAll(newSlotsAvailable);
      }
    }

    return slotsAvailable;
  }
}