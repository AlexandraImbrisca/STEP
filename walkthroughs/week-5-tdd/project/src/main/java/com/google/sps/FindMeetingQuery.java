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

  /**
   * Checks if at least one of the target attendees is also
   * a participant of the current event.
   * @param currentEvent The event.
   * @param targetAttendees The attendees that will be searched through
   * the attendee list of the currentEvent.
   * @return The truth value of the condition described.
   */
  private boolean checkEventAttendees(Event currentEvent,
      Collection<String> targetAttendees) {

    Set<String> currentEventAttendees = currentEvent.getAttendees();

    for (String currentAttendee : currentEventAttendees) {
      if (targetAttendees.contains(currentAttendee)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Computes the "difference" slots - just like the difference of
   * two sets, the difference slots represent the slots resulted after
   * eliminating the minorSlot from the mainSlot.
   *
   * Based on how the slots are scheduled we can have one of the
   * following cases:
   *
   * Case 1: |---|          |---|      - mainSlot
   *            |---| or |---|         - minorSlot
   *    =>   |--|            |--|
   *
   * Case 2: |---------|       |---|    - mainSlot
   *            |---|    or |---------| - minorSlot
   *    =>   |--|   |--|    |--|   |--|
   *
   * @param mainSlot The main slot as described above.
   * @param minorSlot The minor slot as described above.
   * @param duration The duration of the target event for filtering
   * the resulted slots (only slots with at least the same duration
   * will be considered)
   * @return The filtered list of the resulted slots.
   */
  private List<TimeRange> differenceSlots(TimeRange mainSlot,
      TimeRange minorSlot, int targetDuration) {
    List<TimeRange> resultingSlots = new ArrayList<TimeRange>();

    // Determine the common interval that should be removed from the
    // mainSlot (intersection slot).
    int excludingSlotStart = Math.max(mainSlot.start(), minorSlot.start());
    int excludingSlotEnd = Math.min(mainSlot.end(), minorSlot.end());

    // Determine the remaining left slot after extracting the intersection
    int remainingLeftSlotStart = mainSlot.start();
    int remainingLeftSlotEnd = excludingSlotStart;
    int remainingLeftSlotDuration = remainingLeftSlotEnd - remainingLeftSlotStart;

    // Ignore slots too short
    if (remainingLeftSlotDuration >= targetDuration) {
      resultingSlots.add(TimeRange.fromStartEnd(remainingLeftSlotStart,
          remainingLeftSlotEnd, false));
    }

    // Determine the remaining right slot after extracting the intersection
    int remainingRightSlotStart = excludingSlotEnd;
    int remainingRightSlotEnd = mainSlot.end();
    int remainingRightSlotDuration = remainingRightSlotEnd - remainingRightSlotStart;

    // Ignore slots too short
    if (remainingRightSlotDuration >= targetDuration) {
      resultingSlots.add(TimeRange.fromStartEnd(remainingRightSlotStart,
          remainingRightSlotEnd, false));
    }

    return resultingSlots;
  }

  /**
   * Computes the available slots after considering all the events to which
   * the target attendees participate.
   * @param currentEvents The events already scheduled.
   * @param targetAttendees The attendees of the desired event.
   * @param availableSlots The initial slots that will be filtered
   * based on the already attending events of the target participants.
   * @param targetDuration The duration of the desired event.
   */
  public void getSlotsAvailable(Collection<Event> currentEvents,
      Collection<String> targetAttendees, List<TimeRange> availableSlots,
      int targetDuration) {

    // For each of the events already scheduled.
    for (Event currentEvent : currentEvents) {
      // Check if the event is attended by at least one of the target.
      // participants.
      if (checkEventAttendees(currentEvent, targetAttendees)) {
        List<TimeRange> newAvailableSlots = new ArrayList<TimeRange>();
        TimeRange currentEventSlot = currentEvent.getWhen();

        // Iterate through all the currently available slots.
        Iterator iterator = availableSlots.iterator();
        while (iterator.hasNext()) {
          TimeRange currentSlot = (TimeRange)iterator.next();

          // If the overlaps
          if (currentSlot.overlaps(currentEventSlot)) {
            // Remove the current slot
            iterator.remove();
            // And add any subslots that might be available.
            newAvailableSlots.addAll(differenceSlots(currentSlot,
                currentEventSlot, targetDuration));
          }
        }

        // Add the new slots to the list.
        availableSlots.addAll(newAvailableSlots);
      }
    }
  }

  public Collection<TimeRange> query(Collection<Event> events,
      MeetingRequest request) {
    // Initialise the list of available slots
    List<TimeRange> slotsAvailable = new ArrayList<TimeRange>();
    int duration = (int)request.getDuration();

    // Impossible to schedule an event longer than a day
    if (duration > TimeRange.WHOLE_DAY.duration()) {
      return slotsAvailable;
    }

    // Initially, the whole day is available for scheduling the event.
    slotsAvailable.add(TimeRange.WHOLE_DAY);

    Collection<String> mandatoryAttendees = request.getAttendees();
    getSlotsAvailable(events, mandatoryAttendees, slotsAvailable, duration);

    return slotsAvailable;
  }
}